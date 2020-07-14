'use strict'

const Parametro = use('App/Models/Parametro')
const Exceptions = require('../../../Exceptions/CustomException')

class ParametroController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') &&
      (userRegister.status.toLowerCase() === 'ativo')) {
        /** O id vai ser fixo(id'1'), pois apenas existirá um parametro **/
        const parametro = await Parametro.find(1)

        /** Se não existir cria. **/
        if (!parametro) {
          const data = request.only(['taxaTransferencia'])
          await Parametro.create(data)
          return response.status(201).send({ message: 'Parâmetro cadastrado!' })
        } else {
          /** Se existir atualiza para o novo, nunca cria outro. **/
          const data = request.only(['taxaTransferencia'])
          await new Parametro()
          parametro.merge(parametro.taxaTransferencia = data.taxaTransferencia)
          await parametro.save()
          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        }
      } else {
        return response.status(401).send({ message: 'Usuário Inativo/Permissão Negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async index ({ response }) {
    const parametro = await Parametro.query().fetch()
    return parametro
  }

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) {
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const parametro = await Parametro.findOrFail(params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      if ((userRegister.permission.toLowerCase() === 'administrador') &&
      (userRegister.status.toLowerCase() === 'ativo')) {
        await parametro.delete()
        return response.status(201).send({ message: 'Parametro removido com sucesso' })
      } else {
        return response.status(401).send({ message: 'Inativo/Permissão nagada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async update (parametroId, response) {
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
    const parametro = await Parametro.findOrFail(params.id)
    return parametro
  }
}

module.exports = ParametroController
