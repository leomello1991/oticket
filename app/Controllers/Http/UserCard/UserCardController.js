'use strict'

const { Utils } = use('App/Helpers/Utils')
const Exceptions = require('../../../Exceptions/CustomException')
const UserCard = use('App/Models/UserCard')

class UserCardController {
  async store ({ request, response, auth }) { // Criando usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const data = Utils.convertJasonLowercase(request.all([
        'cardNumber',
        'cardholder',
        'validity',
        'cpf',
        'cliente_id'
      ]))

      // Transformando string de busca em minuscula para não dar problemas.
      data.cardholder = data.cardholder.toString().toLowerCase()

      await UserCard.create(data)

      return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async update ({ params, request, response, auth }) { // Atualiza um usuário
    try {
      const verifyToken = await auth.check() // Checando token

      // Alterações serão feitas neste ID
      const userCard = await UserCard.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const data = Utils.convertJasonLowercase(request.only([
        'cardNumber',
        'cardholder',
        'validity',
        'cpf',
        'cliente_id'
      ]))

      userCard.merge(data)

      // Vai alterar o name, então coloca tudo como maiúsculo
      if (request.body.cardholder) {
        userCard.cardholder = request.body.cardholder.toString().toLowerCase()
      }

      await userCard.save()
      return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) { // Remove um  usuário
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      const userCard = await UserCard.findOrFail(params.id)
      await userCard.delete()
      return response.status(201).send({ sucess: 'Cartão de Crédito removido com sucesso' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async index ({ response }) {
    const userCards = await UserCard.query().fetch()
    return userCards
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const userCard = await UserCard.findOrFail(params.id)
    return userCard
  }
}

module.exports = UserCardController
