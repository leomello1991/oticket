'use strict'

const Database = use('Database')
const moment = require('moment')
const User = use('App/Models/User')
const Lote = use('App/Models/Lote')
const Ingresso = use('App/Models/Ingresso')
const Venda = use('App/Models/Venda')
const VendaItem = use('App/Models/VendaItem')
const Evento = use('App/Models/Evento')
const Exceptions = require('../../../Exceptions/CustomException')

/* AMBIENTE DE TESTES */
class TestesController {
  // VendaController / store
  async buyTickets ({ request, response, auth }) {
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
          console.log('qtdeComprada: ' + dados.tickets.length)

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

          /* Percorre array de tickets */
          for (let i = 0; i < dados.qtdeComprada; i++) {
            const ingresso = await Ingresso
              .query()
              .where('lote_id', lote.id)
              .where('situacao', 'aberto')
              .orderBy('id')
              .first() // retorna o primeiro que encontrar

            /* CONSOLE************************************************/
            console.log('*************** Ingresso **********************')
            console.log('Ingresso ID: ' + ingresso.id)
            console.log('data Venda: ' + venda.data)
            console.log('nome: ' + dados.tickets[i].name)
            console.log('surname: ' + dados.tickets[i].surname)
            console.log('cpf: ' + dados.tickets[i].cpf)
            console.log('dataNascimento: ' + dados.tickets[i].data_nascimento)
            // console.log('gender: '+ dados.tickets[i].gender)
            console.log('situacao:  utilizado')
            console.log('origem: site')
            console.log('cliente_id: ' + venda.cliente_id)
            console.log('venda_id: ' + venda.id)
            console.log('venda_item_id: ' + dadosVendaItem.id)
            console.log('user_id: ' + venda.user_id)
            console.log('********************************************************')
            /* CONSOLE************************************************/

            /* Salvando no banco de dados */
            await Ingresso
              .query()
              .where('id', ingresso.id)
              .update({
                data: venda.data,
                nome: dados.tickets[i].name, // coloquei o do cliente que fez a compra por enquanto
                sobrenome: dados.tickets[i].surname, // ver como vai fazer
                cpf: dados.tickets[i].cpf,
                dataNascimento: dados.tickets[i].data_nascimento,
                // genero: dados.tickets[i].gender,
                situacao: 'utilizado',
                origem: 'site', // Esta opção é pq o cliente esta no site
                cliente_id: venda.cliente_id,
                venda_id: venda.id,
                venda_item_id: dadosVendaItem.id,
                user_id: venda.user_id
              })
            /* FIM - Salvando no banco de dados */
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
  async allComissary ({ request }) {
    const { meioPagamento, valorTotal, qtdeTotal, data } = request.all()

    console.log('meio de pagto: ' + meioPagamento)
    console.log('valorTotal: ' + valorTotal)
    console.log('qtdeTotal: ' + qtdeTotal)
    console.log('data: ' + data.length)
    // console.log('lotes: '+data.lotes.length)
    // console.log('tickets: '+tickets.length)

    for (let i = 0; i < data.length; i++) {
      const dados = data[i]

      for (let i = 0; i < dados.lotes.length; i++) {
        console.log('==========================================================')
        console.log('idLote: ' + dados.lotes[i].idLote)
        console.log('qtdeComprada: ' + dados.lotes[i].qtdeComprada)
        console.log('==========================================================')
        console.log('tickets: ' + dados.lotes[i].tickets[i].name)
        console.log('tickets: ' + dados.lotes[i].tickets[i].surname)
        console.log('tickets: ' + dados.lotes[i].tickets[i].cpf)
        console.log('tickets: ' + dados.lotes[i].tickets[i].data_nascimento)
        console.log('==========================================================')
      }
    }
  }

  // ------------------------------------------------------------------------ //

  async testeData ({ request }) {
    // const data = await Lote.findBy('id', teste)

    // // Verificamos se primeira data é igual, maior ou menor que a segunda
    // if (new Date().getTime() === data.viradaLote.getTime()) {
    //   console.log('As datas são iguais')
    // } else if (new Date().getTime() > data.viradaLote.getTime()) {
    //   console.log(new Date().toString() + ' maior que ' + data.viradaLote.toString())
    // } else {
    //   console.log(new Date().toString() + ' menor que ' + data.viradaLote.toString())
    // }
  }

  // ------------------------------------------------------------------------ //

  /* Mostra lote */
  async showEventsWithLotes ({ request }) {
    const { nome, page, pageSize } = request.get()

    /* 1. Validação data: Se data for < que newDate(), evento já foi realizado, INATIVA. */
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
      .with('lotes', (builder) => {
        builder.where('status', 'ativo') // Mostra apenas os lotes ativos
      })
      .where('nome', 'like', nome.toLowerCase() + '%')
      .where('status', 'ativo')
      .orderBy('nome')
      .paginate(page, pageSize)
    return evento
  }

  // ------------------------------------------------------------------------ //

  async mostraLotesAtivos ({ request }) { // vai para show lotes
    /* 1. Quando clicar no evento na tela HOME, o front me mandara o id do evento
    e o back carregará os lotes daquele evento */
    const { evento } = request.all()
    console.log(evento)

    /* 1º  Vou inativar todos os lotes com a dataVirada Expirada */
    await Lote
      .query()
      .where('viradaLote', '<', new Date())
      .whereNot('status', 'inativo')
      .where('evento_id', evento)
      .ids()
      .update({
        status: 'inativo'
      })

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
          .where('evento_id', evento)
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
            .where('evento_id', evento)
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

    /* 7º Mostra Lotes válidos do Evento */
    const lotes = await Lote
      .query()
      .where('evento_id', evento)
      .where('status', 'ativo')
      .fetch()
    return lotes
  }

  // ------------------------------------------------------------------------ //

  async showUser ({ request }) {
    const user = await User.findOrFail(request.params.id)
    return user
  }

  // ------------------------------------------------------------------------ //

  /* Conversão de data para o formato que quizer */
  async testFormatDate ({ request }) {
    const { date } = request.all()

    var data = moment((date), 'DD/MM/YYYY')
    // const newDate = moment(date).format('YYYY/MM/DD')
    return data
  }

  // ------------------------------------------------------------------------ //

  async object ({ request, response, view }) {
    // const { cpfA } = request.get()

    // // const ingressos = await Ingresso.findBy('cpf', cpfA)
    // // const ingresso = new Object(ingressos)
    // // const {
    // //   id,
    // //   cpf,
    // //   dataNascimento,
    // //   nome,
    // //   sobrenome,
    // //   genero,
    // //   email,
    // //   evento_id,
    // //   lote_id,
    // //   status
    // // } = ingresso
    //

    // return (id, cpf)
  }

  async a () {
    const sangria = await Database
      .from('log_sangrias as lg')
      .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
      .select('lg.*')
      .select('e.nomeSite')
      .paginate()
    return sangria
  }

  static async RECEBEconexoesController (a, b) {
    console.log(a, b)
    const soma = a + b + 100
    return soma
  }
}
module.exports = TestesController
