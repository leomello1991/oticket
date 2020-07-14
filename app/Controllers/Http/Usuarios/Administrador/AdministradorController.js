'use strict'

const { Utils } = use('App/Helpers/Utils')
const User = use('App/Models/User')
const Exceptions = require('../../../../Exceptions/CustomException')
const Database = use('Database')

class AdministradorController {
  async store ({ request, auth, response }) { // Criando usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'email',
              'password',
              'name',
              'status', // ATIVO
              'celPhone',
              'permission', // ADMINISTRADOR
              'dataCadastro',
              'user_id'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          // Verifica email existe.
          const search = await User.findBy('email', data.email)
          if (search) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Verifica se campo telefone está correto.
          if (data.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          await User.create(data)

          return response.status(201).send({ message: 'Administrador cadastrado com sucesso!' })
        } else { return response.status(401).send({ message: 'Administrador inativo!' }) }
      } else { return response.status(401).send({ message: 'Permissão negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  async index (page, pageSize) { // Buscando todos usuários
    const data =
      await User.query()
        .orderBy('name')
        .where('status', 'ativo')
        .where('permission', 'administrador')
        .paginate(page, pageSize)
    return data
  }

  // -------------------------------------------------------------------------//

  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      // Alterações serão feitas neste ID
      const user = await User.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'email',
              'password',
              'name',
              'status',
              'celPhone',
              'permission' // ADMINISTRADOR
            ])),
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

          user.merge(data)

          // Verifica se campo telefone está correto.
          if (user.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          await user.save()

          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        } else { return response.status(401).send({ message: 'Administrador Inativo!' }) }
      } else { return response.status(401).send({ message: 'permissão negada!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  async destroy ({ params, request, response, auth }) { // Remove um  usuário
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const user = await User.findOrFail(request.params.id)
      const data = await request.all(['page, pageSize, status, register'])
      // true = pesquisa de grupo
      // false = retorna todos

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      if (user.id !== userRegister.id) {
        if ((userRegister.status.toLowerCase() === 'ativo') &&
          (userRegister.permission.toLowerCase() === 'administrador')) {
          // Inativando usuário...
          await Database
            .table('users')
            .where('id', user.id)
            .update({
              status: data.status
            })
          if (data.register === 'true') {
            return this.index(data.page, data.pageSize)
          }
          if (data.register === 'false') {
            return Utils.returnAllUsers()
          }
          // return response.status(201).send({ sucess: `Usuário removido com sucesso` })
        } else { return response.status(401).send({ message: 'Permissão negada ou INATIVO!' }) }
      } else { return response.status(401).send({ message: 'Usuário não pode se excluir!' }) }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  async show ({ request, response }) {
    try {
      const { page, pageSize, name } = request.get()

      if (name) {
        const data =
          await User.query()
            .orderBy('name')
            .where('name', 'like', name + '%')
            .where('status', 'ativo')
            .where('permission', 'administrador')
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await User.query()
            .orderBy('name')
            .where('status', 'ativo')
            .where('permission', 'administrador')
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }
}

module.exports = AdministradorController
