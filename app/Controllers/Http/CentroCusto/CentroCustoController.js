'use strict'

const { Utils } = use('App/Helpers/Utils')
const CostCenter = use('App/Models/CentroCusto')
const Exceptions = require('../../../Exceptions/CustomException')

/*
-> Quem pode acessar?

-> Campos tabela:
  -> descricao - Exemplos??
  -> user_id
*/

class CentroCustoController {
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
        await CostCenter.create(data)
        return this.index()
      } else {
        return response.status(400).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  async update ({ response, params, request, auth }) {
    try {
      const verifyToken = await auth.check()

      const cost = await CostCenter.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'descricao'
          ])),
          user_id: request.user_id
        }
        cost.merge(data)
        await cost.save()
        return this.index()
      } else {
        return response.status(401).send({ message: 'permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  async destroy ({ params, request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      const cost = await CostCenter.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        await cost.delete()
        return this.index()
      } else {
        return response.status(401).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  async index () {
    const costs = await CostCenter.query().orderBy('descricao').paginate()
    return costs
  }

  /****************************************************************************/

  async show ({ params, request, response, view }) {
    const costs = await CostCenter.findOrFail(params.id)
    return costs
  }
}

module.exports = CentroCustoController
