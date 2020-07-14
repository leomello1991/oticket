'use strict'

const { Utils } = use('App/Helpers/Utils')
const Fornecedor = use('App/Models/Fornecedor')
const Categoria = use('App/Models/Categoria')
const Exceptions = require('../../../../Exceptions/CustomException')
const Database = use('Database')

class FornecedorController {
  async store ({ request, auth, response }) { // Cria usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR OU PRODUTOR
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'celPhone',
              'email',
              'cpf',
              'rg',
              'cnpj',
              'ie',
              'bank',
              'agency',
              'account',
              'city',
              'status',
              'categoria_id',
              'nameFavorecido',
              'cpfFavorecido',
              'cnpjFavorecido',
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

          /* Passando descricao da categoria e transformando em id */
          const categoria = await Categoria.findBy('descricao', data.categoria_id)
          data.categoria_id = categoria.id

          // Checando se email já existe...
          const searchEmail = await Fornecedor.findBy('email', data.email)
          if (searchEmail) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Checando se cpf já existe...
          const searchCPF = await Fornecedor.findBy('cpf', data.cpf)
          if ((searchCPF) && (data.cpf !== null)) {
            return response.status(401).send({ message: 'CPF já existe!' })
          }

          // Checando se rg já existe...
          const searchRG = await Fornecedor.findBy('rg', data.rg)
          if ((searchRG) && (data.rg !== null)) {
            return response.status(401).send({ message: 'RG já existe!' })
          }

          // Checando se cnpj já existe...
          const searchCNPJ = await Fornecedor.findBy('cnpj', data.cnpj)
          if ((searchCNPJ) && (data.cnpj)) {
            return response.status(401).send({ message: 'CNPJ já existe!' })
          }

          // Checando se ie já existe...
          const searchIE = await Fornecedor.findBy('ie', data.ie)
          if ((searchIE) && (data.ie)) {
            return response.status(401).send({ message: 'IE já existe!' })
          }

          // Verifica se campo telefone está correto.
          if (data.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }
          console.log(data)
          await Fornecedor.create(data)

          return response.status(201).send({ message: 'Fornecedor cadastrado com sucesso!' })
        }
        return response.status(401).send({ message: 'Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão Negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  async index (page, pageSize) { // Busca todos usuários
    const data =
      await Fornecedor
        .query()
        .where('status', 'ativo')
        .orderBy('name')
        .paginate(page, pageSize)
    return data
  }

  // ----------------------------------------------------------------------- //

  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      // Alterações serão feitas neste ID
      const fornecedor = await Fornecedor.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR ou PRODUTOR
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
        (userRegister.permission.toLowerCase() === 'produtor')) {
        // Se estiver ativo
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'celPhone',
              'email',
              'cpf',
              'rg',
              'cnpj',
              'ie',
              'bank',
              'agency',
              'account',
              'city',
              'status',
              'categoria_id',
              'nameFavorecido',
              'cpfFavorevido',
              'cnpjFavorecido',
              'street',
              'number',
              'neighborhood',
              'locale',
              'postalCode',
              'complement',
              'ufS'
            ])),
            user_id: request.user_id
          }

          console.log(data.categoria_id)
          /* Passando descricao da categoria e transformando em id */
          if (data.categoria_id) {
            const categoria = await Categoria.findBy('descricao', data.categoria_id)
            data.categoria_id = categoria.id
          }

          // Validação de existência de EMAIL
          if (data.email) {
            if (data.email !== fornecedor.email) {
              const search = await Fornecedor.findBy('email', data.email)
              if (search) {
                return response.status(400).send({ message: 'Este email já existe!' })
              }
            }
          }

          // Validação de existência de CPF
          if (data.cpf) {
            if (data.cpf !== fornecedor.cpf) {
              const search = await Fornecedor.findBy('cpf', data.cpf)
              if (search) {
                return response.status(400).send({ message: 'Este CPF já existe!' })
              }
            }
          }

          // Validação de existência de RG
          if (data.rg) {
            if (data.rg !== fornecedor.rg) {
              const search = await Fornecedor.findBy('rg', data.rg)
              if (search) {
                return response.status(400).send({ message: 'Este RG já existe!' })
              }
            }
          }

          // Validação de existência de IE
          if (data.ie) {
            if (data.ie !== fornecedor.ie) {
              const search = await Fornecedor.findBy('ie', data.ie)
              if (search) {
                return response.status(400).send({ message: 'Este IE já existe!' })
              }
            }
          }

          // Validação de existência de CNPJ
          if (data.cnpj) {
            if (data.cnpj !== fornecedor.cnpj) {
              const search = await Fornecedor.findBy('cnpj', data.cnpj)
              if (search) {
                return response.status(400).send({ message: 'Este CNPJ já existe!' })
              }
            }
          }

          fornecedor.merge(data)

          // Verifica se campo telefone está correto.
          if (fornecedor.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          await fornecedor.save()
          return response.status(200).send({ message: 'Alteração realizada com sucesso!' })
        }
        return response.status(401).send({ message: 'Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão Negada!' })
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
      const fornecedor = await Fornecedor.findOrFail(request.params.id)
      const data = await request.all(['page, pageSize, status, register'])

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      if (userRegister.status.toLowerCase() === 'ativo') {
        // Se for ADMINISTRADOR
        if (userRegister.permission.toLowerCase() === 'administrador') {
          // Inativando usuário...
          await Database
            .table('fornecedors')
            .where('id', fornecedor.id)
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
        // PRODUTOR
        if (userRegister.permission.toLowerCase() === 'produtor') {
          // Inativando usuário...
          await Database
            .table('fornecedors')
            .where('id', fornecedor.id)
            .update({
              status: data.status
            })
          if (data.register === 'true') {
            return this.index(data.page, data.pageSize)
          }
        }
        return response.status(401).send({ message: 'Permissão Negada!' })
      }
      return response.status(401).send({ message: 'INATIVO!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ----------------------------------------------------------------------- //

  /* Filtro de fornecedor ta tela de Cadastro de fornnecedor - route: filterUsersFornecedor */
  async show ({ params, request, response, view }) {
    try {
      const { page, pageSize, name } = request.get()

      if (name) {
        console.log('name')
        const data =
          await Fornecedor.query()
            .orderBy('name')
            .where('name', 'like', name + '%')
            .where('status', 'ativo')
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await Fornecedor.query()
            .orderBy('name')
            .where('status', 'ativo')
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }
}

module.exports = FornecedorController
