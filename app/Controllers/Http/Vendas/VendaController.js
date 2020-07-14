'use strict'

const IngressoController = use('App/Controllers/Http/Ingresso/IngressoController')
const moment = require('moment')
const Database = use('Database')
const Encryption = use('Encryption')
const Lote = use('App/Models/Lote')
const Evento = use('App/Models/Evento')
const Ingresso = use('App/Models/Ingresso')
const Venda = use('App/Models/Venda')
const VendaItem = use('App/Models/VendaItem')
const Exceptions = require('../../../Exceptions/CustomException')

class VendaController {
  /* SITE - Faz a venda na parte do cliente - route: vendas */
  async store ({ request, response, auth }) {
    try {
      /* Verificação de usuário através do token */
      const verifyToken = await auth.check()
      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      /* Cliente logado no sistema */
      if (userRegister.permission.toLowerCase() === 'cliente') {
        console.log('')
        console.log('Quem esta fazendo a compra: ' + userRegister.name)
        console.log('')

        console.log('DADOS ENVIADOS PELO FRONT ==================================')

        const { valorTotal, qtdeTotal, data } = request.all()

        /* Salva dados na venda *************************************************/
        const dadosVenda = {
          ...request.only(['meioPagamento']),
          user_id: request.user_id
        }
        dadosVenda.data = new Date() // data do momento da compra
        dadosVenda.cliente_id = userRegister.id // usuário que está logado no site
        dadosVenda.user_id = request.user_id
        dadosVenda.valorTotal = valorTotal
        dadosVenda.qtdeTotal = qtdeTotal
        /*
          Se meio de pagamento == boleto então situação = aguardando
          Se meio de pagamento == cartao então situação = ativo
        */
        if (dadosVenda.meioPagamento === 'cartao de credito') {
          dadosVenda.situacao = 'ativo'
        }
        if (dadosVenda.meioPagamento === 'boleto') {
          dadosVenda.situacao = 'aguardando pagamento'
        }

        console.log('DADOS DA VENDA ============================================')
        console.log('data: ' + dadosVenda.data)
        console.log('cliente: ' + dadosVenda.cliente_id)
        console.log('situacao: ' + dadosVenda.situacao)
        console.log('meioPagamento: ' + dadosVenda.meioPagamento)
        console.log('valorTotal: ' + dadosVenda.valorTotal)
        console.log('qtdeTotal: ' + dadosVenda.qtdeTotal)
        console.log('Usuário Logado: ' + dadosVenda.user_id)
        console.log('===========================================================')
        console.log('')

        const venda = await Venda.create(dadosVenda)
        /* Fecha dados na venda ***********************************************/

        for (let i = 0; i < data.length; i++) {
          const dados = data[i]
          console.log('idLote: ' + dados.idLote)
          console.log('qtdeComprada: ' + dados.qtdeComprada)
          console.log('qtdeComprada: ' + dados.ticket.length)

          /* Validando se existe a qtde de ingressos ************************/
          const ingressosAbertos = await Ingresso
            .query()
            .where('situacao', 'aberto')
            .where('lote_id', dados.idLote)
            .getCount()

          console.log(ingressosAbertos)
          console.log(dados.idLote)

          if (dados.qtdeComprada > ingressosAbertos) {
            return response.status(400).send({ message: 'Quantidade excede o número de ingressos abertos para venda.' })
          }
          /* FIM - Validando se existe a qtde de ingressos ******************/

          /* CRIANDO VENDA_ITEM DE INGRESSO *********************************/
          console.log('CRIANDO VENDA_ITEM em INGRESSO ===========================')
          /* Variaveis para guardar dados e salvar me Venda (valorTotal, qtdeTotal) */

          console.log('idLote: ' + dados.idLote + ', qtdeComprada: ' + dados.qtdeComprada)

          const lote = await Lote.findBy('id', dados.idLote)

          // COcNSOLE.LOG
          console.log('qtde: ' + dados.qtdeComprada)
          console.log('valor: ' + lote.valor)
          console.log('valorTotal: ' + dados.qtdeComprada * lote.valor)
          console.log('Usuario: ' + userRegister.id)
          console.log('VEnda: ' + venda.id)
          console.log('loteID: ' + lote.id)
          console.log('')
          // CONSOLE.LOG

          /* Preciso criar a vendaItem e salvar nos Ingressos */
          const dadosVendaItem = new VendaItem()
          dadosVendaItem.quantidade = dados.qtdeComprada
          dadosVendaItem.valor = lote.valor
          dadosVendaItem.valorTotal = dados.qtdeComprada * lote.valor
          dadosVendaItem.user_id = userRegister.id
          dadosVendaItem.venda_id = venda.id
          dadosVendaItem.lote_id = lote.id
          await dadosVendaItem.save()
          /* Fim - Criando VendaItem Ingrasso *******************************/

          /* Percorre array de ticket */
          for (let i = 0; i < dados.qtdeComprada; i++) {
            const ingresso = await Ingresso
              .query()
              .where('lote_id', lote.id)
              .where('situacao', 'aberto')
              .orderBy('id')
              .first() // retorna o primeiro que encontrar

            /* Captando dados para guardar no QrCode */
            // -> Dados do lote: Nome, Tipo
            const nomeLote = lote.nome
            const tipoLote = lote.tipoLote

            // -> Dados do evento: Nome, Hora Inicio
            const evento = await Evento
              .query()
              .where('id', lote.evento_id)
              .first()

            const nomeEvento = evento.nome
            const horaInicio = evento.horaInicio

            const data =
              `Lote: ${nomeLote}\n
               Tipo Lote: ${tipoLote}\n
               Evento: ${nomeEvento}\n
               Hora: ${horaInicio}\n
               Cliente: ${dados.ticket[i].name}\n
               CPF: ${dados.ticket[i].cpf}`

            // Criptografrando e enviando para campo qrCode no banco de dados
            const dataEncrypted = await Encryption.encrypt(data)
            console.log('tamanho da string: ' + dataEncrypted.length)
            /* Fim capta dados para QrCode */

            /* CONSOLE************************************************/
            console.log('*************** Ingresso **********************')
            console.log('Ingresso ID: ' + ingresso.id)
            console.log('QRCode: ' + dataEncrypted)
            console.log('data Venda: ' + venda.data)
            console.log('nome: ' + dados.ticket[i].name)
            console.log('surname: ' + dados.ticket[i].surname)
            console.log('cpf: ' + dados.ticket[i].cpf)
            console.log('dataNascimento: ' + dados.ticket[i].dateBirth)
            console.log('gender: ' + dados.ticket[i].gender)
            console.log('email: ' + dados.ticket[i].email)
            console.log('situacao:  utilizado')
            console.log('origem: site')
            console.log('cliente_id: ' + venda.cliente_id)
            console.log('venda_id: ' + venda.id)
            console.log('venda_item_id: ' + dadosVendaItem.id)
            console.log('user_id: ' + venda.user_id)
            console.log('********************************************************')
            /* CONSOLE************************************************/

            /* Front irá mandar a data neste formato DD/MM/YYYY e back irá salvar
            neste formato YYYY/MM/DD */
            const newDate = moment((dados.ticket[i].dateBirth), 'DD/MM/YYYY')
            console.log('Como irar guar a data: ' + newDate)

            const utilizado = 'utilizado'
            const site = 'site'

            /* Enviando dados para Salvar ingresso */
            await IngressoController.update(
              ingresso.id,
              venda.data,
              dataEncrypted,
              dados.ticket[i].name,
              dados.ticket[i].surname,
              dados.ticket[i].cpf,
              newDate,
              dados.ticket[i].gender,
              dados.ticket[i].email,
              utilizado,
              site, // Esta opção é pq o cliente esta no site
              venda.cliente_id,
              venda.id,
              dadosVendaItem.id,
              venda.user_id
            )
          }
        }
      }
      return response.status(200).send({ message: 'Compra realizada com sucesso!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async index ({ request, response, view }) {
    const vendas = await Venda.query().orderBy('data').paginate()
    return vendas
  }

  // ------------------------------------------------------------------------ //

  async show ({ params }) {
    const venda = await Venda.findOrFail(params.id)

    const respVenda = await Venda
      .query()
      .where('id', venda.id)
      .fetch()
    return respVenda
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response }) {
    const venda = await Venda.findOrFail(request.params.id)
    await venda.delete()
    return response.status(200).json({ sucess: { message: 'Venda removida com sucesso' } })
  }

  // ------------------------------------------------------------------------ //

  async update ({ params, request, response }) {
    const venda = await Venda.findOrFail(request.params.id)

    const data = {
      ...request.only([
        'data',
        'situacao', // ativo,cancelada
        'meioPagamento', // dinheiro,cartao
        'evento_id',
        'comissario_id',
        'cliente_id',
        'user_id'// Usuário logado
      ]),
      user_id: request.user_id // guardando usuário logado no bando de dados.
    }
    venda.merge(data)
    await venda.save()
    return response.status(200).json({ sucess: { message: 'Alteração realizada com sucesso' } })
  }

  // ------------------------------------------------------------------------ //
  /*
  -> ADM
  -> Route: salesAdm
  -> Retorna todas as vendas para o Admininstrador
  */
  async salesAdm ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check()
      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      const { page, pageSize } = request.get()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        const vendas = await Database
          .from('ingressos as i')
          .innerJoin('lotes as l', 'l.id', 'i.lote_id')
          .innerJoin('eventos as e', 'e.id', 'i.evento_id')
          .innerJoin('vendas as v', 'v.id', 'i.venda_id')
          .select(
            'i.id as ticketId',
            'i.valor as ticketValue',
            'i.origem as ticketType',
            'v.id as saleId',
            'i.data as saleDate',
            'v.meioPagamento as paymentMethod',
            'e.nomeSite as nameEvent',
            'l.nome as nameLote',
            'i.nome as client',
            'i.cpf as clientCpf',
            'i.comissario_id as comissaryId'
          )
          .where('i.situacao', 'utilizado')
          .orderBy('i.data')
          .orderBy('i.comissario_id')
          .paginate(page, pageSize)
        return vendas
      } else {
        return response.status(400).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }
}

module.exports = VendaController
