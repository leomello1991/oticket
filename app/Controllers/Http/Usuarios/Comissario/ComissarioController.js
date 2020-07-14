'use strict'

const { Utils } = use('App/Helpers/Utils')
const User = use('App/Models/User')
const Exceptions = require('../../../../Exceptions/CustomException')
const Database = use('Database')

class ComissarioController {
  async store ({ request, auth, response }) { // Criando usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'dataCadastro',
              'name',
              'celPhone',
              'email',
              'password',
              'cpf',
              'rg',
              'cnpj',
              'status',
              'permission',
              'comissario_id'// COMISSARIO
            ])),
            user_id: request.user_id
          }

          // Checando se email já existe...
          const searchEmail = await User.findBy('email', data.email)
          if (searchEmail) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Checando se cpf já existe...
          const searchCPF = await User.findBy('cpf', data.cpf)
          if ((searchCPF) && (data.cpf !== null)) {
            return response.status(401).send({ message: 'CPF já existe!' })
          }

          // Checando se rg já existe...
          const searchRG = await User.findBy('rg', data.rg)
          if ((searchRG) && (data.rg !== null)) {
            return response.status(401).send({ message: 'RG já existe!' })
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

          /* Em caso se subComissario tenho que guardar o id do Comissario */

          if (data.permission === 'sub comissario') {
            /* Procurando comissario para pegar id */
            const searchComissario = await User
              .query()
              .where('name', data.comissario_id)
              .where('permission', 'comissario')
              .first()

            /* Salvando comissario_id na tabela */
            data.comissario_id = searchComissario.id
          }

          await User.create(data)

          return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
        }
        return response.status(401).json({ message: 'INATIVO!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

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

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'celPhone',
              'email',
              'password',
              'cpf',
              'rg',
              'status',
              'permission', // comissario
              'comissario_id',
              'cnpj'
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

          if (data.cpf) {
            if (data.cpf !== user.cpf) {
              const search = await User.findBy('cpf', data.cpf)
              if (search) {
                return response.status(400).send({ message: 'Este CPF já existe!' })
              }
            }
          }

          // Validação de existência de RG
          if (data.rg) {
            if (data.rg !== user.rg) {
              const search = await User.findBy('rg', data.rg)
              if (search) {
                return response.status(400).send({ message: 'Este RG já existe!' })
              }
            }
          }

          if (data.cnpj) {
            if (data.cnpj !== user.cnpj) {
              const search = await User.findBy('cnpj', data.cnpj)
              if (search) {
                return response.status(400).send({ message: 'Este CPF já existe!' })
              }
            }
          }

          if (data.comissario_id) {
            console.log(user.permission)
            if (user.permission === 'sub comissario') {
              /* Procurando comissario para pegar id */
              const searchComissario = await User
                .query()
                .where('name', data.comissario_id)
                .first()

              /* Salvando comissario_id na tabela */
              data.comissario_id = searchComissario.id
            } else {
              return response.status(400).send({ message: 'Permissão negada, usuário comissário.' })
            }
          }

          user.merge(data)

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

  // ----------------------------------------------------------------------- //

  async destroy ({ params, request, response, auth }) { // Remove um  usuário
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const user = await User.findOrFail(request.params.id)
      const data = await request.all(['page, pageSize, status, register'])

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR ou PRODUTOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo e se não for ele mesmo
        if (userRegister.status.toLowerCase() === 'ativo') {
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
        }
        return response.status(401).send({ message: 'Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  /* Mostra todos comissarios e sub comissarios - ADM */
  async index (page, pageSize) {
    const data =
      await User.query()
        .orderBy('name')
        .where('status', 'ativo')
        .whereIn('permission', ['comissario', 'sub comissario'])
        .paginate(page, pageSize)
    return data
  }

  // ----------------------------------------------------------------------- //

  /* Busca apenas os comissarios - Tela Cadastro de SubComissario - ADM */
  /* Busca apenas os comissarios - Tela Cadastro de Eventos - ADM */
  async showComissarios () {
    const data =
      await User.query()
        .orderBy('name')
        .where('status', 'ativo')
        .where('permission', 'comissario')
        .paginate()
    return data
  }

  // ----------------------------------------------------------------------- //

  /* Filtro de Comissario e sub comissario por nome - ADM */
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
            .whereIn('permission', ['comissario', 'sub comissario'])
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await User.query()
            .orderBy('name')
            .where('status', 'ativo')
            .whereIn('permission', ['comissario', 'sub comissario'])
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }
}

module.exports = ComissarioController
