'use strict'

const Ingresso = use('App/Models/Ingresso')
const Exceptions = require('../../../Exceptions/CustomException')
const Database = use('Database')

class IngressoController {
  static async store (a, b, c, d, e, f, g, h, i, j, k, l) {
    /*
    -> Função: LoteController / store
    -> A criação do Ingresso é feita quando o Lote é criado por isso alguns dados
      do ingresso vem do lote.
    */
    console.log(a, b, c, d, e, f, g, h, i, j, k, l)
    const ingresso = new Ingresso()
    ingresso.qrCode = a
    ingresso.origem = b
    ingresso.situacao = c
    ingresso.valor = d
    ingresso.evento_id = e
    ingresso.lote_id = f
    ingresso.user_id = g
    ingresso.venda_id = h
    ingresso.venda_item_id = i
    ingresso.comissario_id = j
    ingresso.cliente_id = k
    ingresso.status = l
    await ingresso.save()
  }

  // ------------------------------------------------------------------------ //

  static async update (ticketId, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    /*
    -> Função: VendaController / store
    -> O update é feito no ato da venda, quando o cliente compra o ingresso é
      feito o update dos campos abaixo.
    */
    await Ingresso
      .query()
      .where('id', ticketId)
      .update({
        data: a,
        qrCode: b,
        nome: c,
        sobrenome: d,
        cpf: e,
        dataNascimento: f,
        genero: g,
        email: h,
        situacao: i,
        origem: j, // Esta opção é pq o cliente esta no site
        cliente_id: k,
        venda_id: l,
        venda_item_id: m,
        user_id: n,
        comissario_id: o
      })
  }

  // ------------------------------------------------------------------------ //

  async index ({ request, response, view }) {
    const ingressos = await Ingresso.query().orderBy('id').paginate()
    return ingressos
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const ingresso = await Ingresso.findOrFail(params.id)
    console.log(ingresso.id)
    return ingresso
  }

  // ------------------------------------------------------------------------ //

  /*
  -> SITE
  -> Route: showTickets
  -> Mostra ingresso de um determinado cliente
  */
  async showTickets ({ params, request, response, view }) {
    const { id, page, pageSize } = request.all()

    const ingressos = await Database
      .from('ingressos as i')
      .innerJoin('eventos as e', 'i.evento_id', 'e.id')
      .innerJoin('venda_items as vi', 'vi.id', 'i.venda_item_id')
      .innerJoin('vendas as v', 'v.id', 'i.venda_id')
      .innerJoin('lotes as l', 'l.id', 'i.lote_id')
      .select(
        'i.id as ingressoId',
        'e.id as EventoId',
        'e.nome as nomeEvento',
        'e.local as LocalEvento',
        'e.data as dataEvento',
        'e.horaInicio',
        'e.url_imagemHome',
        'e.url_imagemIngresso',
        'v.id as vendaId',
        'v.data as dataVenda',
        'v.situacao as situacaoVenda',
        'v.meioPagamento',
        'v.cliente_id',
        'v.comissario_id',
        'v.valorTotal as valorTotalVenda',
        'v.qtdeTotal as qtdeTotalVenda',
        'vi.id as vendaItemId',
        'vi.quantidade as qtdeVendaItem',
        'vi.valor as valorVendaItem',
        'vi.valorTotal as valorTotalVendaItem',
        'l.id as loteId',
        'tipoLote'
      )
      .where('i.cliente_id', id)
      .paginate(page, pageSize)
    return ingressos
  }

  // ------------------------------------------------------------------------ //

  /*
  -> ADM
  -> Route: showTicketsCPF
  -> Mostra os ingressos de um cliente
  */
  async showTicketsCPF ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Verifica token

      if (!verifyToken) {
        return response.status(401).json('Token inválido')
      }

      const { cpf } = request.get()

      const searchCPF = await Ingresso.findBy('cpf', cpf)

      if (!searchCPF) {
        return response.status(401).json({ message: 'CPF não encontrado!' })
      }
      const tickets = await Ingresso
        .query()
        .where('cpf', cpf)
        .paginate()
      return tickets
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  /*
  -> SITE / Meus ingressos
  -> Route: myTickets
  -> Busca pelo cpf, apenas os ingressos que estão no cpf aparecerão.
  -> O usuário logado vai poder ver os ingressos que estão cadastrados no seu cpf.
  */

  async myTickets ({ auth, response }) {
    try {
      const verifyToken = await auth.check() // Verifica token

      if (!verifyToken) {
        return response.status(401).json('Token inválido')
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      const tickets = await Ingresso
        .query()
        .where('cpf', userRegister.cpf)
        .paginate()
      return tickets
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response }) {
    const ingresso = await Ingresso.findOrFail(params.id)
    await ingresso.delete()
    return response.status(201).json({ sucess: 'Ingresso removido com sucesso' })
  }
}

module.exports = IngressoController
