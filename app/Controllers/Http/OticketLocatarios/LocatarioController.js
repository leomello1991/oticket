'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Exceptions = require('../../../Exceptions/CustomException')

class LocatarioController {
  async store ({ request, auth, response }) { // Criando usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...request.only([
              'name',
              'celPhone',
              'email',
              'cnpj',
              'ie',
              'permission',
              'postalCode',
              'street',
              'neighborhood',
              'locale',
              'ufS',
              'number',
              'complement',
              'locatario_id' /* Apenas se permission === pontoVenda */
            ]),
            user_id: request.user_id,
            status: 'ativo'
          }

          // Transformando string de busca em minuscula para não dar problemas.
          data.name = data.name.toString().toLowerCase()

          // Checando se email já existe...
          const searchEmail = await User.findBy('email', data.email)
          if (searchEmail) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Checando se rg já existe...
          const searchCNPJ = await User.findBy('cnpj', data.cnpj)
          if ((searchCNPJ) && (data.cnpj !== null)) {
            return response.status(401).send({ message: 'CNPJ já existe!' })
          }

          // Verifica se campo telefone está correto.
          if (data.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          if (data.permission === 'pontoVenda') {
            /* Procurando locatario para pegar id */
            const searchLocatario = await User
              .query()
              .where('name', data.locatario_id)
              .where('permission', 'locatario')
              .first()

            /* Salvando locatario_id na tabela */
            data.locatario_id = searchLocatario.id
          }

          await User.create(data)

          return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
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
      const user = await User.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...request.only([
              'name',
              'celPhone',
              'email',
              'cnpj',
              'ie',
              'permission',
              'postalCode',
              'street',
              'neighborhood',
              'locale',
              'ufS',
              'number',
              'complement',
              'status',
              'locatario_id' /* Apenas se permission === pontoVenda */
            ]),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          // Validação de existência de email
          if (data.email) {
            if (data.email !== user.email) {
              const search = await User.findBy('email', data.email)
              if (search) {
                return response.status(400).send({ message: 'Este email já existe!' })
              }
            }
          }

          if (data.cnpj) {
            if (data.cnpj !== user.cnpj) {
              const search = await User.findBy('cnpj', data.cnpj)
              if (search) {
                return response.status(400).send({ message: 'Este CNPJ já existe!' })
              }
            }
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

          user.merge(data)

          // Vai alterar o name, então coloca tudo como maiúsculo
          if (request.body.name) {
            user.name = request.body.name.toString().toLowerCase()
          }

          // Verifica se campo telefone está correto.
          if (user.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          await user.save()
          return response.status(200).send({ message: 'Alteração no usuário realizada com sucesso!' })
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

  async inative ({ params, request, response, auth }) { // Inativar um  usuário
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const user = await User.findOrFail(request.params.id)
      const data = await request.all(['page, pageSize'])

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token inválido!' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          await Database
            .table('users')
            .where('id', user.id)
            .update({
              status: 'inativo'
            })
          return this.showAllLocatarios(data.page, data.pageSize)
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

  /* Carrega listagem de locatários ATIVOS qdo inativa um locatário na função inative() - ADM */
  async showAllLocatarios (page, pageSize) {
    const data =
      await User.query()
        .orderBy('name')
        .where('permission', 'locatario')
        .where('status', 'ativo')
        .paginate(page, pageSize)
    return data
  }

  /****************************************************************************/

  /* Filtro de Locatario por nome - ADM */
  async showLocatario ({ request, response }) {
    try {
      const { page, pageSize, name } = request.get()

      if (name) {
        console.log('name')
        const data =
          await User.query()
            .orderBy('name')
            .where('name', 'like', name + '%')
            .where('status', 'ativo')
            .where('permission', 'locatario')
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await User.query()
            .orderBy('name')
            .where('status', 'ativo')
            .where('permission', 'locatario')
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }

  /****************************************************************************/

  /* ADM - Mostra os Pontos de Venda de um Locatário - route: showPontoVenda */
  async showPontoVenda ({ request, response }) {
    try {
      const { name } = request.all()

      // Buscando id do locatário pelo nome
      const locatario = await User
        .query()
        .where('name', name)
        .where('permission', 'locatario')
        .first()

      const pontovendas = await User
        .query()
        .where('locatario_id', locatario.id)
        .paginate()
      return pontovendas
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }

  /****************************************************************************/

  /* Mostra todos Locatários - Back */
  async index () {
    const data =
      await User.query()
        .orderBy('name')
        .where('permission', 'locatario')
        .paginate()
    return data
  }

  /****************************************************************************/

  /* Deleta 1 locatário - Back */
  async destroy ({ params, request, response }) {
    const locatario = await User.findOrFail(params.id)
    await locatario.delete()
    return response.status(201).json({ sucess: 'Locatário removido com sucesso' })
  }
}

module.exports = LocatarioController
