'use strict'

const { Utils } = use('App/Helpers/Utils')
const Exceptions = require('../../../Exceptions/CustomException')
const CloudinaryService = use('App/Services/CloudinaryService')
const Evento = use('App/Models/Evento')
const EventoComissario = use('App/Models/EventoComissario')
const EventoProdutore = use('App/Models/EventoProdutore')
const Database = use('Database')
const User = use('App/Models/User')
const Grupo = use('App/Models/Grupo')
const Lote = use('App/Models/Lote')

class EventoController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // Tem que ser USUÀRIO ATIVO
      if (userRegister.status.toLowerCase() === 'ativo') {
        // Permissão ADMINISTRADOR
        if ((userRegister.permission.toLowerCase() === 'administrador') ||
        (userRegister.permission.toLowerCase() === 'produtor')) {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'nome', // o q aparecerá no site
              'nomeSite', // o q ficara no banco - minusculo
              'data',
              'horaInicio',
              'horaFim',
              'local',
              'cidade',
              'imagemHome',
              'imagemIngresso',
              'dadosInformativos',
              'status', // ativo,inativo,cancelado
              'user_id',
              'vendaIngresso', // ativo,desabilitado
              'taxaVendaCartao',
              'taxaAcrescimoCompraSite',
              'custoPrevisto',
              'receitaPrevista',
              'banners',
              'linkFanpage'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          /* Recebe o nome dos produtores, comissarios e grupos do evento, nestes arrays */
          const { produtores, comissarios } = request.all()

          // Transformando string de busca em minuscula para não dar problemas.
          data.nomeSite = data.nome.toString().toLowerCase()

          // /** ATT: NO CADASTRO DE EVENTO O USUÁRIO DEVE IMPORTAR AS IMAGENS REQUERIDAS.
          // Enviando Imagens para servidor, salvando url e public_id no banco de dados. **/
          const img1 = request.file('imagemHome')
          const img2 = request.file('imagemIngresso')
          console.log('img1' + img1)

          const response1 = await CloudinaryService.v2.uploader.upload(img1.tmpPath, { folder: 'oticket' })
          const response2 = await CloudinaryService.v2.uploader.upload(img2.tmpPath, { folder: 'oticket' })

          const evento = await Evento.create(data)

          // /** Salvando URL e publicID de imagens no banco de dados**/
          await Evento
            .query()
            .where('id', evento.id)
            .update({
              url_imagemHome: response1.secure_url,
              url_imagemIngresso: response2.secure_url,
              publicID_imagemHome: response1.public_id,
              publicID_imagemIngresso: response2.public_id
            })

          /* Condição feita pq se o usuário não mandar o produtor o evento é cadastrado msm assim */
          if (produtores) {
            /** Vai guardar na tabela (EventoProdutor) os produtores que estão neste evento. **/
            await this.saveProductor(produtores, evento.id, evento.user_id)
          }

          /* Condição feita pq se o usuário não mandar o comissario e o grupo o evento é cadastrado msm assim */
          if (comissarios) {
            /** Vai guardar na tabela (EventoProdutor) os produtores que estão neste evento. **/
            await this.saveComissaryGroup(comissarios, evento.id, evento.user_id)
          }
          return response.status(201).send({ message: 'Evento cadastrado com sucesso!' })
        } else {
          return response.status(401).send({ message: 'Permissão negada!' })
        }
      } else {
        return response.status(401).send({ message: 'Usuário Inativo!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  /** Toda vez que se cria um evento é preciso salvar o produtor deste evento
  na tabela (evento_produtor) **/
  async saveProductor (produtores, eventoId, userId) {
    /* Salva produtor na tabela evento_produtores */
    for (let i = 0; i < produtores.length; i++) {
      console.log('produtor:' + produtores[i].nome)

      /* Trasformar nome em id para procurar na tabela de usuarios */
      const searchProdutor = await User
        .query()
        .where('name', produtores[i].nome)
        .where('permission', 'produtor')
        .first()

      /* Save produtor in table evento_produtores */
      console.log('produtor_id: ' + searchProdutor.id)
      console.log('evento_id: ' + eventoId)
      console.log('user_id: ' + userId)
      console.log('==========================================================')

      const eventoProdutor = new EventoProdutore()
      eventoProdutor.produtor_id = searchProdutor.id
      eventoProdutor.evento_id = eventoId
      eventoProdutor.user_id = userId
      await eventoProdutor.save()
    }
  }

  // -------------------------------------------------------------------------//

  /** Toda vez que se cria um evento é preciso salvar o comissario e o grupo
  que ele faz parte na tabela (EventoComissario) **/
  async saveComissaryGroup (comissarios, eventoId, userId) {
    /* Salva comissarios e grupos na tabela evento_comissarios */
    for (let i = 0; i < comissarios.length; i++) {
      console.log('comissario: ' + comissarios[i].nomeComissario)

      for (let j = 0; j < comissarios[i].grupos.length; j++) {
        /* Trasformar nome em id para procurar na tabela de usuarios */
        const searchComissario = await User
          .query()
          .where('name', comissarios[i].nomeComissario)
          .where('permission', 'comissario')
          .first()

        /* Trasformar descricao em id para procurar na tabela de grupos */
        const searchGroup = await Grupo.findBy('descricao', comissarios[i].grupos[j].descricao)

        /* Save comissario in table evento_comissarios */
        console.log('comissario_id: ' + searchComissario.id)
        console.log('grupo_id: ' + searchGroup.id)
        console.log('evento_id: ' + eventoId)
        console.log('user_id: ' + userId)
        console.log('status: ativo')
        console.log('data: ' + new Date())
        console.log('==========================================================')

        const eventoComissario = new EventoComissario()
        eventoComissario.comissario_id = searchComissario.id // id do comissário
        eventoComissario.grupo_id = searchGroup.id // id do grupo
        eventoComissario.evento_id = eventoId
        eventoComissario.user_id = userId
        eventoComissario.status = 'ativo'
        eventoComissario.data = new Date() // data atual
        await eventoComissario.save()
      }
    }
  }

  // -------------------------------------------------------------------------//

  async update ({ params, request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      // Alterações serão feitas neste ID
      const evento = await Evento.findOrFail(request.params.id)

      if (!verifyToken) {
        return response
          .status(401)
          .json('token invalido')
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.status.toLowerCase() === 'ativo') {
        if ((userRegister.permission.toLowerCase() === 'administrador') ||
        (userRegister.permission.toLowerCase() === 'produtor')) {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'nome',
              'nomeSite',
              'data',
              'horaInicio',
              'horaFim',
              'local',
              'cidade',
              'imagemHome',
              'imagemIngresso',
              'dadosInformativos',
              'status', // ativo,inativo,cancelado
              'user_id',
              'vendaIngresso', // ativo,desabilitado
              'taxaVendaCartao',
              'taxaAcrescimoCompraSite',
              'custoPrevisto',
              'receitaPrevista',
              'banners',
              'linkFanpage',
              'produtor_id',
              'comissario_id',
              'grupo_id'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }
          evento.merge(data)

          // Vai alterar o name, então coloca tudo como maiúsculo
          if (request.body.nome) {
            evento.nomeSite = request.body.nome.toString().toLowerCase()
          }

          await evento.save()
          return response.status(200).send({ message: 'Evento alterado com sucesso!' })
        } else {
          return response.status(401).send({ message: 'Permissão negada!' })
        }
      } else {
        return response.status(401).send({ message: 'Usuário Inativo!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  // Exclui o evento e as imagens relacionadas (EXCLUI TUDO)
  async destroy ({ params, request, response, auth }) { // Remove um  evento
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido}' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      const evento = await Evento.findOrFail(request.params.id)

      /* Se achar algum lote neste evento não exclui */
      const lote = await Lote.findBy('evento_id', evento.id)
      console.log(lote)
      if (lote) {
        return response.status(400).send({ message: 'Este evento possui Lotes!' })
      }

      if (lote === null) {
      // DELETE - Apenas ADMINISTRADOR pode excluir evento
        if (userRegister.permission.toLowerCase() === 'administrador') {
          // Se estiver ativo e se não for ele mesmo
          if (userRegister.status.toLowerCase() === 'ativo') {
            if ((evento.publicID_imagemHome) || (evento.publicID_imagemIngresso)) {
              // Excluindo imagens do servidor Cloudinary
              await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemHome)
              await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemIngresso)
            }
            // Excluindo demais dados do banco
            await evento.delete()
            return this.index()
          }
          return response.status(401).send({ message: 'Usuário Inativo!' })
        }
        return response.status(401).send({ message: 'Permissão Negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // -----------------------------------------------------------------------//

  // Escolhe qual imagem quer exluir da tabela ou as duas
  async destroyOnly ({ params, request, response }) {
    const { publicID_imagemHome, publicID_imagemIngresso } = request.get()
    console.log('publicID_imagemHome: ' + publicID_imagemHome)// teste
    console.log('publicID_imagemIngresso: ' + publicID_imagemIngresso)// teste

    if ((publicID_imagemHome) && (publicID_imagemIngresso === '')) {
      console.log('publicID_imagemHome')// teste
      const evento = await Evento.findBy('publicID_imagemHome', publicID_imagemHome)
      const aux = evento.publicID_imagemHome // Guardando public_id

      await Database
        .table('eventos')
        .where('publicID_imagemHome', publicID_imagemHome)
        .update({
          publicID_imagemHome: null,
          url_imagemHome: null
        })

      await CloudinaryService.v2.uploader.destroy(aux)
      return response.status(200).send({ message: 'Imagem removida com sucesso!' })
    }

    if ((publicID_imagemIngresso) && (publicID_imagemHome === '')) {
      console.log('publicID_imagemIngresso')// teste
      const evento = await Evento.findBy('publicID_imagemIngresso', publicID_imagemIngresso)
      const aux = evento.publicID_imagemIngresso // Guardando public_id

      await Database
        .table('eventos')
        .where('publicID_imagemIngresso', publicID_imagemIngresso)
        .update({
          publicID_imagemIngresso: null,
          url_imagemIngresso: null
        })

      await CloudinaryService.v2.uploader.destroy(aux)
      return response.status(200).send({ message: 'Imagem removida com sucesso!' })
    }

    if ((publicID_imagemIngresso) && (publicID_imagemHome)) {
      console.log('os 2 setados')// teste
      const evento = await Evento.findBy('publicID_imagemHome', publicID_imagemHome)

      await Database
        .table('eventos')
        .where('publicID_imagemHome', publicID_imagemHome)

        .update({
          publicID_imagemHome: null,
          url_imagemHome: null,
          publicID_imagemIngresso: null,
          url_imagemIngresso: null
        })
      await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemHome)
      await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemIngresso)
      return response.status(200).send({ message: 'Imagens removidas com sucesso!' })
    }
    if ((publicID_imagemHome === '') && (publicID_imagemIngresso === '')) {
      console.log('vazios') // teste
      return response.status(400).send({ message: 'Nenhum item selecionado' })
    }
  }

  // -----------------------------------------------------------------------//

  async updateImageIngresso ({ request, response }) {
    const evento = await Evento.findOrFail(request.params.id)
    try {
      // UPDATE da imagemHome, primeiro exclui de pois cria
      // Excluindo ...
      await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemIngresso)

      // Criando ...
      const img1 = request.file('imagemIngresso')
      const response1 = await CloudinaryService.v2.uploader.upload(img1.tmpPath, { folder: 'oticket' })

      // Alterando...
      await Database
        .table('eventos')
        .where('id', evento.id)
        .update({
          publicID_imagemIngresso: response1.public_id,
          url_imagemIngresso: response1.secure_url
        })
      return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
    } catch (erro) {
      return response.status(400).send({ message: 'Algo deu errado!' })
    }
  }

  // -------------------------------------------------------------------------//

  async updateImageHome ({ request, response }) {
    const evento = await Evento.findOrFail(request.params.id)
    try {
      // UPDATE da imagemHome, primeiro exclui de pois cria
      // Excluindo ...

      await CloudinaryService.v2.uploader.destroy(evento.publicID_imagemHome)

      // Criando ...
      const img2 = request.file('imagemHome')
      const response2 = await CloudinaryService.v2.uploader.upload(img2.tmpPath, { folder: 'oticket' })

      // Alterando...
      await Database
        .table('eventos')
        .where('id', evento.id)
        .update({
          publicID_imagemHome: response2.public_id,
          url_imagemHome: response2.secure_url
        })
      return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
    } catch (erro) {
      // return response.status(400).send({message: `Algo deu errado!`})
    }
  }

  // -------------------------------------------------------------------------//

  /*
  -> SITE
  -> Route: filterEvents
  -> Mostra apenas os eventos ativos na HOME e faz busca pelo nome
  */
  async filterEvent ({ request }) {
    const { nome, page, pageSize } = request.get()

    /* Inativando eventos com a data menor que à data atual. */
    await Evento
      .query()
      .where('data', '<', new Date())
      .whereNot('status', 'inativo')
      .ids()
      .update({
        status: 'inativo'
      })

    const evento = await Evento
      .query()
      .where('nomeSite', 'like', nome.toLowerCase() + '%')
      .where('status', 'ativo')
      .orderBy('data', 'desc')
      .paginate(page, pageSize)
    return evento
  }

  // -------------------------------------------------------------------------//

  /* ADM
    -> Mostra todos os eventos com (produtores, comissarios) ativos.
    -> route: showEvents
    */
  async show ({ request, response }) {
    try {
      const { nome, page, pageSize } = request.get()

      const evento = await Evento
        .query()
        .with('produtores')
        .with('comissarios')
        .where('nomeSite', 'like', nome.toLowerCase() + '%')
        .where('status', 'ativo')
        .orderBy('nomeSite')
        .paginate(page, pageSize)
      return evento
    } catch (message) {
      return response.status(400).send({ message: 'Evento não encontrado' })
    }
  }

  // -------------------------------------------------------------------------//

  /*
  -> ADM
  -> route: showEventID
  -> Retorna o Evento requisitado pelo ID
   */
  async showEventID ({ request }) {
    const event = await Evento.findOrFail(request.params.id)
    return event
  }

  // -------------------------------------------------------------------------//

  async index () {
    const event = await Evento.query().orderBy('id').where('status', 'ativo').paginate()
    return event
  }
}
module.exports = EventoController
