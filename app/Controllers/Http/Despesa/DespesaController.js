'use strict'

const { Utils } = use('App/Helpers/Utils')
const Expense = use('App/Models/Despesa')
const Exceptions = require('../../../Exceptions/CustomException')

/*
-> Quem pode acessar?

-> Campos tabela:
  -> descricao - Exemplos??
  -> user_id
*/

class DespesaController {
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
        await Expense.create(data)
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

      const expense = await Expense.findOrFail(params.id)

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
        expense.merge(data)
        await expense.save()
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

      const expense = await Expense.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        await expense.delete()
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
    const expenses = await Expense.query().orderBy('descricao').paginate()
    return expenses
  }

  /****************************************************************************/

  async show ({ params }) {
    const expenses = await Expense.findOrFail(params.id)
    return expenses
  }
}

module.exports = DespesaController
