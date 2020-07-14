'use strict'

const IngressoController = use('App/Controllers/Http/Ingresso/IngressoController')
const { Utils } = use('App/Helpers/Utils')
const Lote = use('App/Models/Lote')
const Evento = use('App/Models/Evento')
const Ingresso = use('App/Models/Ingresso')
const Database = use('Database')
const Exceptions = require('../../../Exceptions/CustomException')

class LoteController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Verifica token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // ADM e PRODUTOR podem fazer cadastro de lotes.
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {
        // Tem que estar ATIVO
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'nome',
              'valor',
              'quantidade',
              'nroIngressosCpf',
              'viradaLote',
              'status', // ativo,inativo
              'tipoLote', // inteira, meia, promocional, cortesia
              'evento_id'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          /* Passando descricao do evento e transformando em id */
          const evento = await Evento.findBy('nomeSite', data.evento_id)
          data.evento_id = evento.id

          const lote = await Lote.create(data)

          const aberto = 'aberto'
          // Criando ingressos conforme a quantidade passada
          for (let i = 0; i < lote.quantidade; i++) {
            /*
            -> Local da função: IngressosController / store
            -> Salva os ingressos conforme a qtde que é criada no Lote.
            */
            await IngressoController.store(
              null, /* Será preenchido na venda, dados do cliente criptografados */
              null, /* Será preenchido na venda - (importado, fisico, online, site) */
              aberto, // CRIA(aberto), UPDATE(utilizado)
              lote.valor,
              lote.evento_id,
              lote.id,
              lote.user_id,
              null, // campo preenchido apenas na compra
              null, // campo preenchido apenas na venda
              null, // campo preenchido apenas na venda
              null, // campo preenchido apenas na venda
              0 // 0 - FALSE - Quando o ingresso for transferido vai para 1 - TRUE, o ingresso pode ser transf. apenas 1 vez
            )
          }

          return response.status(201).send({ message: 'Lote cadastrado com sucesso!' })
        } else { return response.status(401).send({ message: 'Usuário Inativo!' }) }
      } else { return response.status(401).send({ message: 'Permissão Negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Alterações serão feitas neste ID
      const lote = await Lote.findOrFail(request.params.id)

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'nome',
              'valor',
              'quantidade',
              'nroIngressosCpf',
              'viradaLote',
              'status', // ativo,inativo
              'tipoLote', // inteira, meia, promocional, cortesia
              'evento_id'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          /* Passando descricao do evento e transformando em id */
          if (data.evento_id) {
            const evento = await Evento.findBy('nomeSite', data.evento_id)
            data.evento_id = evento.id
          }

          lote.merge(data)

          // Vai alterar o name, então coloca tudo como minusculo
          if (request.body.nome) {
            lote.nome = request.body.nome.toString().toLowerCase()
          }

          await lote.save()

          // Alterando ingressos comforme se altera lote
          for (let i = 0; i < lote.quantidade; i++) {
            // Quando o usuário faz alterações no lote ele se estende para o ingresso.
            await this.modificaIngresso(lote.id)
          }

          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        } else { return response.status(401).send({ message: 'Usuário Inativo!' }) }
      } else { return response.status(401).send({ message: 'Permissão negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  // Criando Ingresso através de dados enviados pelo lote.
  async modificaIngresso (idLote) {
    const lote = await Lote.findBy('id', idLote) // comparando parametro com id da tabela
    const buscaId = await Ingresso.findBy('lote_id', idLote) // achando linha onde esta o fk_lote

    await Ingresso
      .query()
      .where('id', buscaId.id)
      .update({
        valor: lote.valor,
        evento_id: lote.evento_id,
        user_id: lote.user_id
      })
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) {
    const verifyToken = await auth.check() // Checando token

    try {
      // Realizando busca de ID
      const lote = await Lote.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      // DELETE - Apenas ADMINISTRADOR pode excluir lote
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {
        // Se estiver ativo e se não for ele mesmo
        if (userRegister.status.toLowerCase() === 'ativo') {
          // Se remover o lote remove os ingressos.
          for (let i = 0; i < lote.quantidade; i++) {
            // Quando o usuário faz alterações no lote ele se estende para o ingresso.
            await this.destroyIngresso(lote.id)
          }
          await lote.delete()
          return response.status(200).send({ message: 'Lote excluido com sucesso!' })
        } else { return response.status(401).send({ message: 'Usuário Inativo!' }) }
      } else { return response.status(401).send({ message: 'Permissão negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //
  async destroyIngresso (idLote) {
    const lote = await Lote.findBy('id', idLote)

    await Ingresso
      .query()
      .where('lote_id', lote.id)
      .where('situacao', 'aberto')
      .delete()
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const lotes = await Lote.findOrFail(params.id)

    await lotes.load('evento')
    await lotes.load('user')

    return lotes
  }

  // ------------------------------------------------------------------------ //

  /* Mostra todos os LOTES (ativo e inativo) a partir do nome do Evento - ADM */
  async index ({ request }) { // route: lotes
    const { page, pageSize, nomeEvento } = request.all()

    const lotes = await Database
      .from('lotes as L')
      .innerJoin('eventos as E', 'L.evento_id', 'E.id')
      .select('L.*')
      .select('E.nomeSite as nomeEvento')
      .where('E.nomeSite', 'like', nomeEvento + '%')
      .paginate(page, pageSize)
    return lotes
  }

  // ------------------------------------------------------------------------ //

  /* Mostra todos os lotes ativo de determinado evento - YURI */
  async showLotes ({ params }) { // route: showLotes
    const evento = await Evento.findOrFail(params.id)
    console.log(evento.id)

    /* 1º  Vou inativar todos os lotes com a dataVirada Expirada */
    await Lote
      .query()
      .where('viradaLote', '<', new Date())
      .whereNot('status', 'inativo')
      .where('evento_id', evento.id)
      .ids()
      .update({
        status: 'inativo'
      })

    /* Excluindo ingressos abertos de lotes inativados */
    const teste = await Database
      .table('lotes as l')
      .innerJoin('ingressos as i', 'i.lote_id', 'l.id')
      .where('l.status', 'inativo')
      .where('l.viradaLote', '<', new Date())
      .where('i.situacao', 'aberto')
      .pluck('i.id')

    // Excluindo ingressos ABERTOS de evento que foi inativado
    console.log(teste)
    for (let i = 0; i < teste.length; i++) {
      const ingresso = await Ingresso.findBy('id', teste[i])
      ingresso.delete()
    }

    /* 2º Fazendo o for para fazer a validação em cada tipo de lote */
    let tipo = ''
    for (let i = 0; i < 4; i++) {
      console.log('indice: ' + i)
      if (i === 0) {
        tipo = 'inteira'
      }
      if (i === 1) {
        tipo = 'meia'
      }
      if (i === 2) {
        tipo = 'cortesia'
      }
      if (i === 3) {
        tipo = 'promocional'
      }

      console.log('tipo: ' + tipo)
      if (tipo) {
        /* 3° Verificando se tem algum lote que está válido. */
        const loteAtivo = await Lote
          .query()
          .where('viradaLote', '>', new Date())
          .where('status', 'ativo')
          .where('evento_id', evento.id)
          .where('tipoLote', tipo)
          .first()

        /* 4º Se não tiver nenhum lote válido posso entrar, para procurar um novo lote valido */
        if (!loteAtivo) {
          console.log('verifica lotes')

          /* 5º vou procurar um lote inativo e com data válida */
          const searchLote = await Lote
            .query()
            .where('status', 'inativo')
            .where('viradaLote', '>', new Date())
            .where('tipoLote', tipo)
            .where('evento_id', evento.id)
            .first()

          /* 6º Se eu tiver achado esse lote, então eu ativo para aparecer na lista */
          if (searchLote) {
            await Lote
              .query()
              .where('id', searchLote.id)
              .update({
                status: 'ativo'
              })
            console.log('Siatuação do Lote: ID: ' + searchLote.id + ', status: ' + searchLote.status)
          }
        }
      }
    }

    const lotes = await Database
      .from('lotes as l')
      .innerJoin('eventos as e', 'e.id', 'l.evento_id')
      .select(
        'e.id as EventoId',
        'e.data as dataEvento',
        'e.nome as nomeEvento',
        'e.local as LocalEvento',
        'e.data as dataEvento',
        'e.horaInicio',
        'e.horaFim',
        'e.cidade',
        'e.status',
        'e.url_imagemHome',
        'e.url_imagemIngresso',
        'e.taxaAcrescimoCompraSite',
        'e.taxaVendaCartao',
        'l.id as idlote',
        'l.nome as nomeLote',
        'l.valor as valorLote',
        'l.quantidade',
        'l.nroIngressosCpf',
        'l.viradaLote',
        'l.tipoLote'
      )
      .where('e.id', evento.id)
      .where('l.status', 'ativo')
    return lotes
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Mostra lote a partir do ID do evento - route: showEventLotes */
  async showLotesADM ({ request }) {
    const { id, page, pageSize } = request.get()

    /* 1. Validação data: Se data for < que newDate(), evento já foi realizado, INATIVA. */
    await Evento
      .query()
      .where('data', '<', new Date())
      .whereNot('status', 'inativo')
      .ids()
      .update({
        status: 'inativo'
      })

    if (id) {
      const lotes = await Database
        .from('lotes as l')
        .innerJoin('eventos as e', 'e.id', 'l.evento_id')
        .where('l.evento_id', id)
        .select('l.*')
        .select('e.nome as nomeEvento')
        .where('l.status', 'ativo')
        .paginate(page, pageSize)
      return lotes
    }
    if (id === '') {
      const lotes = await Database
        .from('lotes as l')
        .innerJoin('eventos as e', 'e.id', 'l.evento_id')
        .select('l.*')
        .select('e.nome as nomeEvento')
        .where('l.status', 'ativo')
        .paginate(page, pageSize)
      return lotes
    }
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Rota para que depois que deletar um lote mande parametro para a
  função indexEventLotes que retorna os lotes do evento.
  -> route: deleteEventLotes
  */
  async deleteEventLotes ({ params, response, auth }) {
    const verifyToken = await auth.check()

    try {
      // Realizando busca de ID
      const lote = await Lote.findOrFail(params.id)

      /* Guardando o  ID do evento para mandar como parametro para carregar a
      listagem em (indexEventLote)
      */
      const eventoId = lote.evento_id

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      // DELETE - Apenas ADMINISTRADOR pode excluir lote
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {
        // Se estiver ativo e se não for ele mesmo
        if (userRegister.status.toLowerCase() === 'ativo') {
          // Se remover o lote remove os ingressos.
          for (let i = 0; i < lote.quantidade; i++) {
            // Quando o usuário faz alterações no lote ele se estende para o ingresso.
            await this.destroyIngresso(lote.id)
          }

          await lote.delete()
          return await this.indexEventLote(eventoId)
        } else { return response.status(401).send({ message: 'Usuário Inativo!' }) }
      } else { return response.status(401).send({ message: 'Permissão negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Mostra todos os LOTES ativos de um evento , recebe parametro da função
  deleteEventLote
  */
  async indexEventLote (eventoId) { // route: indexEventLote
    console.log(eventoId)

    const lotes = await Database
      .from('lotes as l')
      .innerJoin('eventos as e', 'e.id', 'l.evento_id')
      .where('l.evento_id', eventoId)
      .select('l.*')
      .select('e.nome as nomeEvento')
      .where('l.status', 'ativo')
      .paginate()
    return lotes
  }
}

module.exports = LoteController
