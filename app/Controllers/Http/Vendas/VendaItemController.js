'use strict'

const VendaItem = use('App/Models/VendaItem')

class VendaItemController {
  async store ({ request }) {
    const data = {
      ...request.only([
        'quantidade',
        'valor',
        'venda_id',
        'lote_id',
        'user_id'// Usuário logado
      ]),
      user_id: request.user_id
    }
    const vendaItem = await VendaItem.create(data)
    return vendaItem
  }

  // ------------------------------------------------------------------------ //

  async index ({ request, response, view }) {
    const vendaItens = await VendaItem.query().fetch()

    return vendaItens
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const vendaItens = await VendaItem.findOrFail(params.id)
    return vendaItens
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response }) {
    const vendaItem = await VendaItem.findOrFail(request.params.id)
    await vendaItem.delete()
    return response.status(201).send({ sucess: 'Venda removido com sucesso' })
  }

  // ------------------------------------------------------------------------ //

  async update ({ params, request, response }) {
    const vendaItem = await VendaItem.findOrFail(request.params.id)
    const data = {
      ...request.only([
        'quantidade',
        'valor',
        'venda_id',
        'lote_id',
        'user_id'// Usuário logado
      ]),
      user_id: request.user_id // guardando usuário logado no bando de dados.
    }
    vendaItem.merge(data)
    await vendaItem.save()
    return response.json('Alteração realizada com sucesso!')
  }
}

module.exports = VendaItemController
