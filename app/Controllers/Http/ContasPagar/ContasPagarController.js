'use strict'

const { Utils } = use('App/Helpers/Utils')
const Amount = use('App/Models/ContasPagar')
const User = use('App/Models/User')
const Exceptions = require('../../../Exceptions/CustomException')

class ContasPagarController {
  /*
  -> Quem pode acessar? - Produtor solicitar e adm efetua

  -> Campos Documentação:
    -> Data Emissão - dateEmission
    -> Data Vencimento - dueDate
    -> Previsão de Pagamento - estimatedPayDate
    -> Valor - value
    -> Centro de Custos - Será uma chave estrangeira?
    -> Valor - outro valor?
    -> Solicitação para pagamento de fornecedor ????? -
    -> Baixas Parciais ????? - Pagamentos Parciais

  -> Campos na Tabela:
    -> dateEmission
    -> dueDate
    -> estimatedPayDate
    -> situation - aberto, agendado, pago, cancelado
    -> value
    -> user_id
    -> evento_id
    -> fornecedor_id
    -> despesa_id - Como será feito este vinculo????
    -> produtor_id
  */

  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }
      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') ||
          (userRegister.permission.toLowerCase() === 'produtor')) {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'dateEmission',
            'dueDate',
            'estimatedPayDate',
            'situation', // aberto, agendado, pago, cancelado
            'value',
            'evento_id',
            'fornecedor_id',
            'despesa_id', // Como será feito este vinculo????
            'produtor_id'
          ])),
          user_id: request.user_id // guardando usuário logado no bando de dados.
        }
        /* Verifica se id é de produtor mesmo */
        const searchProductor = await User
          .query()
          .where('id', data.produtor_id)
          .where('permission', 'produtor')
          .first()

        if (!searchProductor) {
          return response.status(400).send({ message: 'Este ID não pertence a um produtor!' })
        }

        await Amount.create(data)
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

      const amount = await Amount.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') ||
          (userRegister.permission.toLowerCase() === 'produtor')) {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'dateEmission',
            'dueDate',
            'estimatedPayDate',
            'situation', // aberto, agendado, pago, cancelado
            'value',
            'evento_id',
            'fornecedor_id',
            'despesa_id', // Como será feito este vinculo????
            'produtor_id'
          ])),
          user_id: request.user_id
        }
        amount.merge(data)
        await amount.save()
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

      const amount = await Amount.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') ||
          (userRegister.permission.toLowerCase() === 'produtor')) {
        await amount.delete()
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
    const amounts = await Amount.query().paginate()
    return amounts
  }

  /****************************************************************************/

  async show ({ params }) {
    const amounts = await Amount.findOrFail(params.id)
    return amounts
  }
}

module.exports = ContasPagarController
