'use strict'

const { Utils } = use('App/Helpers/Utils')
const User = use('App/Models/User')
const UserCard = use('App/Models/UserCard')
const Exceptions = require('../../../../Exceptions/CustomException')
const Database = use('Database')

class UserController {
  /* Comissário ou Adm cadastra um cliente - route: usersIntermediate */
  async storeIntermediate ({ request, response, auth }) { // Criando usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }
      const userRegister = await auth.getUser()

      // Precisa ser ADMINISTRADOR ou INTERMEDIÁRIO e estar ATIVO
      if (userRegister.status.toLowerCase() === 'ativo') {
        if ((userRegister.permission.toLowerCase() === 'comissario') ||
        (userRegister.permission.toLowerCase() === 'administrador')) {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'surname',
              'dataNascimento',
              'cpf',
              'phone',
              'email',
              'gender',
              'password',
              'permission', // CLIENTE
              'status' // ATIVO
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          // Checando se email já existe...
          const searchEmail = await User.findBy('email', data.email)
          if (searchEmail) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Checando se cpf já existe...
          const searchCPF = await User.findBy('cpf', data.cpf)
          if (searchCPF) {
            return response.status(401).send({ message: 'CPF já existe!' })
          }

          // Verifica se campo telefone está correto.
          if (data.phone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          await User.create(data)
          return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
        } else { // Permissão != de adm ou comissario
          return response.status(401).send({ message: 'Permissão negada!' })
        }
      } else { // Permissão != de adm ou comissario
        return response.status(401).send({ message: 'Inativo!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  // Usuário se cadastra no site - não possui auth(token)
  async storeNew ({ request, response }) { // Criando usuários
    try {
      const data = {
        ...Utils.convertJasonLowercase(request.only([
          'name',
          'surname',
          'dataNascimento',
          'cpf',
          'phone',
          'email',
          'gender',
          'password',
          'permission', // CONSUMIDOR
          'status', // ATIVO
          'dataCadastro'
        ])),
        user_id: request.user_id // guardando usuário logado no bando de dados.
      }

      // Checando se email já existe...
      const searchEmail = await User.findBy('email', data.email)
      if (searchEmail) {
        return response.status(401).send({ message: 'Email já existe!' })
      }

      // Checando se cpf já existe...
      const searchCPF = await User.findBy('cpf', data.cpf)
      if (searchCPF) {
        return response.status(401).send({ message: 'CPF já existe!' })
      }

      // Verifica se campo telefone está correto.
      if (data.phone.length < 14) {
        return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
      }

      await User.create(data)
      return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  async index (page, pageSize) { // Buscando todos usuários
    const data =
      await User.query()
        .orderBy('name')
        .where('status', 'ativo')
        .where('permission', 'cliente')
        .paginate(page, pageSize)
    return data
  }

  // ----------------------------------------------------------------------- //

  async update ({ params, request, response, auth }) { // Atualiza um usuário
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
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'surname',
              'dataNascimento',
              'cpf',
              'phone',
              'email',
              'gender',
              'password',
              'permission', // CONSUMIDOR
              'status', // ATIVO
              'street',
              'number',
              'neighborhood',
              'locale',
              'postalCode',
              'complement',
              'ufS'
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

          // Validação de existência de CPF
          if (data.cpf) {
            if (data.cpf !== user.cpf) {
              const search = await User.findBy('cpf', data.cpf)
              if (search) {
                return response.status(400).send({ message: 'Este CPF já existe!' })
              }
            }
          }

          user.merge(data)

          await user.save()
          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        }
        return response.status(401).send({ message: 'Administrador Inativo!' })
      } // fecha if adm

      // UPDATE - PERMISSÃO CLIENTE
      if (userRegister.permission.toLowerCase() === 'cliente') {
        console.log('cliente')
        // Se for ele mesme e estiver ativo
        if (userRegister.id === user.id &&
          userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...request.only([
              'email',
              'password',
              'name',
              'celPhone',
              'surname',
              'dataNascimento',
              'phone'
            ]),
            user_id: request.user_id
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

          // Validação de existência de CPF
          if (data.cpf) {
            if (data.cpf !== user.cpf) {
              const search = await User.findBy('cpf', data.cpf)
              if (search) {
                return response.status(400).send({ message: 'Este CPF já existe!' })
              }
            }
          }

          user.merge(data)

          // Vai alterar o name, então coloca tudo como maiúsculo
          if (request.body.name) {
            user.name = request.body.name.toString().toLowerCase()
          }

          await user.save()
          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        }
        return response.status(401).send({ message: 'Inativo ou não pode editar outro usuário!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  async destroy ({ params, request, response, auth }) { // Remove um  usuário
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Realizando busca de ID
      const user = await User.findOrFail(request.params.id)
      const data = await request.all(['page, pageSize, status', 'register'])

      // Usuário Logado
      const userRegister = await auth.getUser()

      // DELETE - PERMISSÃO ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo e se não for ele mesmo
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
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  // Mostra um determinado usuário
  async show ({ request, response }) {
    try {
      const { page, pageSize, name } = request.get()

      if (name) {
        console.log('name')
        const data =
          await User.query()
            .orderBy('name')
            .where('name', 'like', name + '%')
            .where('status', 'ativo')
            .where('permission', 'cliente')
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await User.query()
            .orderBy('name')
            .where('status', 'ativo')
            .where('permission', 'cliente')
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }

  // ----------------------------------------------------------------------- //

  /** Quando o usuário está logado é possivel ver quais cartões estão cadastra -
  dos em seu nome. */
  async searchCard ({ auth, response, params, request }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // ID do usuário
      const user = await User.findOrFail(request.params.id)

      /** Carrega lista de cartões cadastrados no usuário informado. */
      const listCard = await UserCard
        .query()
        .where('cliente_id', user.id)
        .paginate()
      return listCard
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  async showUser ({ params, request, response, view }) {
    const user = await User.findOrFail(params.id)
    return user
  }
}

module.exports = UserController
