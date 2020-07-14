'use strict'

const Exceptions = require('../../../Exceptions/CustomException')
const Grupo = use('App/Models/Grupo')

class FilterGroupController {
  async filter ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).json('token invalido')
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      const { page, pageSize, descricao } = request.get()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (descricao === '') {
          const data = await Grupo
            .query()
            .orderBy('descricao')
            .paginate(page, pageSize)
          return data
        }

        if (descricao) {
          const data = await Grupo
            .query()
            .where('descricao', 'like', descricao + '%')
            .orderBy('descricao')
            .paginate(page, pageSize)
          return data
        }
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }
}

module.exports = FilterGroupController
