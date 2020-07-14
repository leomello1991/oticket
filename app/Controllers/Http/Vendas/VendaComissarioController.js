'use strict'

const IngressoController = use('App/Controllers/Http/Ingresso/IngressoController')
const moment = require('moment')
const Encryption = use('Encryption')
const Evento = use('App/Models/Evento')
const Database = use('Database')
const Lote = use('App/Models/Lote')
const Ingresso = use('App/Models/Ingresso')
const Venda = use('App/Models/Venda')
const VendaItem = use('App/Models/VendaItem')
const Exceptions = require('../../../Exceptions/CustomException')

class VendaComissarioController {
  /*
  -> ADM
  -> Route: salesComissary (POST)
  -> Comissário faz a venda dos ingressos.
  */
  async store ({ request, response, auth }) {
    try {
      /* Verificação de comissario através do token */
      const verifyToken = await auth.check()
      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      /* Comissario logado no sistema */
      if ((userRegister.permission.toLowerCase() === 'comissario') || 
          (userRegister.permission.toLowerCase() === 'sub comissario')){
        console.log('')
        console.log('Quem esta fazendo a venda: ' + userRegister.name)
        console.log('')

        console.log('DADOS ENVIADOS PELO FRONT ==================================')

        const { valorTotal, qtdeTotal, data } = request.all()

        /* Salva dados na venda *************************************************/
        const dadosVenda = {
          ...request.only(['meioPagamento']),
          user_id: request.user_id
        }
        dadosVenda.data = new Date() // data do momento da compra
        dadosVenda.comissario_id = request.user_id
        dadosVenda.user_id = request.user_id
        dadosVenda.valorTotal = valorTotal
        dadosVenda.qtdeTotal = qtdeTotal
        /*
          Se meio de pagamento == boleto então situação = aguardando
          Se meio de pagamento == cartao então situação = ativo
        */
        if ((dadosVenda.meioPagamento === 'cartao de credito') ||
            (dadosVenda.meioPagamento === 'cartao de debito') ||
            (dadosVenda.meioPagamento === 'dinheiro')){
          dadosVenda.situacao = 'ativo'
        }
        if (dadosVenda.meioPagamento === 'boleto') {
          dadosVenda.situacao = 'aguardando pagamento'
        }

        console.log('DADOS DA VENDA ============================================')
        console.log('data: ' + dadosVenda.data)
        console.log('comissario_id: ' + dadosVenda.comissario_id)
        // console.log('cliente: '+ dadosVenda.cliente_id)
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
            console.log('origem: online')
            console.log('comissario_id: ' + venda.comissario_id)
            // console.log('cliente_id: '+venda.cliente_id) VER COMO VAI FAZER
            console.log('venda_id: ' + venda.id)
            console.log('venda_item_id: ' + dadosVendaItem.id)
            console.log('user_id: ' + venda.user_id)
            console.log('comissario_id: ' + venda.comissario_id)
            console.log('********************************************************')
            /* CONSOLE************************************************/

             /* Front irá mandar a data neste formato DD/MM/YYYY e back irá salvar
            neste formato YYYY/MM/DD */
            const newDate = moment((dados.ticket[i].dateBirth), 'DD/MM/YYYY')
            console.log('Como irar guar a data: ' + newDate)

            const utilizado = 'utilizado'
            const fisica = 'fisica'

            /* Salvando no banco de dados */
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
              fisica, // Esta opção é quando o Comissário faz a venda
              venda.cliente_id,
              venda.id,
              dadosVendaItem.id,
              venda.user_id,
              venda.comissario_id
            )
            /* FIM - Salvando no banco de dados */
          }
        }
      } else {
        return response.status(400).send({ message: 'Permissão negada!' })
      }
      return response.status(200).send({ message: 'Compra realizada com sucesso!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  /*
  -> ADM
  -> Route: salesComissary (GET)
  -> Dashboard Comissário
  -> Temos 3 opções de parâmetros:
    -> Parâmetro (salesComissary): Se front mandar 'yes', Retorna todas as vendas,
      do comissário logado.
    -> Parâmetro (salesTicketEvent): Se front mandar 'nome Evento', Retorna número
      de Ingressos vendidos por Lote do Evento, do comissário logado.
    -> Parâmetro (amountCollected): se front mandar 'nome Evento', Retorna o valor
      Arrecadado do Evento, do comissário logado.
  */

  async salesComissary ({ auth, response, request }) {
    try {
      /* Verificação de comissario através do token */
      const verifyToken = await auth.check()
      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      console.log('** Retorna todas as vendas do comissário logado **')
      const vendaComissario = await Database
        .from('ingressos as i')
        .innerJoin('lotes as l', 'l.id', 'i.lote_id')
        .innerJoin('eventos as e', 'e.id', 'i.evento_id')
        .innerJoin('vendas as v', 'v.id', 'i.venda_id')
        .select(
          'i.id as ticketID',
          'i.valor as ticketValue',
          'i.origem as ticketType',
          'v.id as saleId',
          'i.data as saleDate',
          'v.meioPagamento as paymentMethod',
          'e.id as eventID',
          'e.nomeSite as nameEvent',
          'l.nome as nameLote',
          'i.nome as client',
          'i.sobrenome as surname',
          'i.dataNascimento as dateBirth',
          'i.genero as gender',
          'i.email as email',
          'i.cpf as clientCpf',
          'i.comissario_id as comissary'
        )
        .where('i.comissario_id', userRegister.id)
        .paginate(1, 100)
      return vendaComissario

      // if ((salesTicketEvent) && (salesComissary === '') && (amountCollected === '')) {
      //   console.log('** Retorna número de Ingressos vendidos por Lote do Evento do comissário Logado **')
      //   /* Encontrar o ID do evento */
      //   const searchEvent = await Evento
      //     .query()
      //     .where('nomeSite', salesTicketEvent)
      //     .first()
      //   console.log(searchEvent.id)

      //   /* Encontrar lotes que estão relacionados com o evento */
      //   const searchLotes = await Lote
      //     .query()
      //     .where('evento_id', searchEvent.id)
      //     .ids()
      //   console.log(searchLotes)

      //   let lotes = []
      //   /* Encontrar ingressos que estão relacionados com o lote */
      //   for (let i = 0; i < searchLotes.length; i++) {
      //     console.log(searchLotes[i])
      //     const ingressos = await Ingresso
      //       .query()
      //       .where('lote_id', searchLotes[i])
      //       .where('situacao', 'utilizado')
      //       .where('comissario_id', userRegister.id)
      //       .ids()

      //     if (ingressos.length > 0) {
      //       lotes = lotes + `Lote: ${searchLotes[i]}, quantidade: ${ingressos.length} ingressos vendidos. `
      //     }
      //     console.log(`Lote: ${searchLotes[i]}, quantidade: ${ingressos.length} ingressos vendidos.`)
      //   }
      //   return response.status(200).send({ message: lotes })
      // }
      // if ((amountCollected) && (salesTicketEvent === '') && (salesComissary === '')) {
      //   console.log('** Retorna o valor arrecadado do evento por comissário **')
      //   /* Encontrar o ID do evento */
      //   const searchEvent = await Evento
      //     .query()
      //     .where('nomeSite', amountCollected)
      //     .first()
      //   console.log(searchEvent.id)

      //   const tickets = await Ingresso
      //     .query()
      //     .sum('valor as Soma Total')
      //     .where('situacao', 'utilizado')
      //     .where('evento_id', searchEvent.id)
      //     .where('comissario_id', userRegister.id)
      //   console.log(tickets)
      //   return tickets
      // }
      // if ((salesComissary) && (salesTicketEvent)) {
      //   console.log('os dois setados')
      //   return response.status(400).send({ message: 'Operação negada!' })
      // }
      // if ((salesComissary === '') && (salesTicketEvent === '')) {
      //   console.log('os dois vazios')
      //   return response.status(400).send({ message: 'Operação negada!' })
      // }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //
}

module.exports = VendaComissarioController
