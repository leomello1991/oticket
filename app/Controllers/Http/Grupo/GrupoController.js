'use strict'

const { Utils } = use('App/Helpers/Utils')
const Grupo = use('App/Models/Grupo')
const Exceptions = require('../../../Exceptions/CustomException')

class GrupoController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'descricao'
            ])),
            user_id: request.user_id
          }

          // Transformando string de busca em minuscula para não dar problemas.
          data.descricao = data.descricao.toString().toLowerCase()

          await Grupo.create(data)

          return this.index()
        } else {
          return response.status(400).send({ message: 'Usuário Inativo!' })
        }
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
    const grupos = await Grupo.query().orderBy('descricao').paginate()
    return grupos
  }

  // ------------------------------------------------------------------------ //

  async update ({ params, request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const grupo = await Grupo.findOrFail(params.id)

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'descricao'
            ])),
            user_id: request.user_id
          }
          grupo.merge(data)

          // Vai alterar o name, então coloca tudo como maiúsculo
          if (request.body.descricao) {
            grupo.descricao = request.body.descricao.toString().toLowerCase()
          }

          await grupo.save()
          return this.index()
        } else {
          return response.status(400).send({ message: 'Usuário Inativo!' })
        }
      } else {
        return response.status(400).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const grupo = await Grupo.findOrFail(params.id)
    return grupo
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) {
    try {
      const verifyToken = await auth.check()

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status === 'ativo') {
          const grupo = await Grupo.findOrFail(params.id)
          await grupo.delete()
          return this.index()
        } else { // inativo
          return response.status(400).send({ message: 'Usuário Inativo!' })
        }
      } else { // permissão negada
        return response.status(201).send({ message: 'Permissão Negada!!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }
}

module.exports = GrupoController
