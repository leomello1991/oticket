'use strict'

const User = use('App/Models/User')
const ProdutoLocatario = use('App/Models/ProdutoLocatario')
const Exceptions = require('../../../Exceptions/CustomException')

class ProdutosLocatarioController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...request.only([
              'productCode',
              'description',
              'unit',
              'value',
              'locatario_id'
            ]),
            user_id: request.user_id
          }

          // Transformando string de busca em minuscula para não dar problemas.
          data.description = data.description.toString().toLowerCase()

          const searchLocatario = await User
            .query()
            .where('name', data.locatario_id)
            .where('permission', 'locatario')
            .first()

          /* Salvando locatario_id na tabela */
          data.locatario_id = searchLocatario.id

          await ProdutoLocatario.create(data)

          return response.status(201).send({ message: 'Produto cadastrado com sucesso!' })
        }
        return response.status(401).json({ message: 'Usuário Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      // Alterações serão feitas neste ID
      const product = await ProdutoLocatario.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...request.only([
              'productCode',
              'description',
              'unit',
              'value',
              'locatario_id'
            ]),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          if (data.locatario_id) {
            /* Procurando comissario para pegar id */
            const searchLocatario = await User
              .query()
              .where('name', data.locatario_id)
              .where('permission', 'locatario')
              .first()

            /* Salvando comissario_id na tabela */
            data.locatario_id = searchLocatario.id
          }

          product.merge(data)

          // Vai alterar o name, então coloca tudo como maiúsculo
          if (request.body.description) {
            product.description = request.body.description.toString().toLowerCase()
          }

          await product.save()
          return response.status(200).send({ message: 'Alteração no produto realizada com sucesso!' })
        }
        return response.status(401).send({ message: 'Administrador Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  async destroy ({ params, request, response, auth }) { // Inativar um  usuário
    const verifyToken = await auth.check() // Checando token
    try {
      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const product = await ProdutoLocatario.findOrFail(params.id)
          await product.delete()
          return this.showAllProducts()
        }
        return response.status(401).send({ message: 'Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  /* ADM - Route: showAllProducts - Carrega listagem dos produtos */
  async showAllProducts (page, pageSize) {
    const data =
      await ProdutoLocatario.query()
        .orderBy('description')
        .paginate(page, pageSize)
    return data
  }

  /****************************************************************************/

  /* ADM - Route: show - Filtra produto  por nome */
  async showProduct ({ request }) {
    const { description } = request.get()
    const data =
        await ProdutoLocatario.query()
          .where('description', 'like', description + '%')
          .orderBy('description')
          .paginate()
    return data
  }
}

module.exports = ProdutosLocatarioController
