'use strict'

const { Utils } = use('App/Helpers/Utils')
const Categoria = use('App/Models/Categoria')
const Exceptions = require('../../../Exceptions/CustomException')

class CategoriaController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'descricao'
          ])),
          user_id: request.user_id // guardando usuário logado no bando de dados.
        }
        await Categoria.create(data)
        return this.index()
      } else {
        return response.status(400).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async index () {
    // Executando query para mostrar todos os registros da Tabela Categoria
    const categorias = await Categoria.query().orderBy('descricao').paginate()
    return categorias
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      const categoria = await Categoria.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        await categoria.delete()
        return this.index()
      } else {
        return response.status(401).send({ message: 'permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async update ({ response, params, request, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      const categoria = await Categoria.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'descricao'
          ])),
          user_id: request.user_id // guardando usuário logado no bando de dados.
        }
        categoria.merge(data)
        await categoria.save()
        return this.index()
      } else {
        return response.status(401).send({ message: 'permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const categoria = await Categoria.findOrFail(params.id)
    return categoria
  }
}

module.exports = CategoriaController
