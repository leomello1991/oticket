'use strict'

const { Utils } = use('App/Helpers/Utils')
const Genero = use('App/Models/Genero')

class GeneroController {
  async store ({ request }) {
    const data = Utils.convertJasonLowercase(request.only(['descricao']))
    const genero = await Genero.create(data)
    return genero
  }

  // ------------------------------------------------------------------------ //

  async index ({ response }) {
    // Executando query para mostrar todos os registros da Tabela Genero
    const generos = await Genero.query().fetch()
    return generos
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response }) {
    const genero = await Genero.findOrFail(params.id)
    await genero.delete()
    return response.status(201).json({ sucess: 'Genero removido com sucesso' })
  }

  // ------------------------------------------------------------------------ //

  async update ({ params, request }) {
    const genero = await Genero.findOrFail(params.id)
    const data = Utils.convertJasonLowercase(request.only(['descricao']))
    genero.merge(data)
    await genero.save()
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const genero = await Genero.findOrFail(params.id)
    return genero
  }
}

module.exports = GeneroController
