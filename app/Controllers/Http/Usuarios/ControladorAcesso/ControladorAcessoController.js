'use strict'

const { Utils } = use('App/Helpers/Utils')
const User = use('App/Models/User')
const Evento = use('App/Models/Evento')
const EventoControladorAcesso = use('App/Models/EventoControladorAcesso')
const Exceptions = require('../../../../Exceptions/CustomException')
const Database = use('Database')

class ControladorAcessoController {
  async store ({ request, auth, response }) { // Cria usuários
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          const data = {
            ...Utils.convertJasonLowercase(request.only([
              'name',
              'celPhone',
              'status',
              'email',
              'password',
              'permission', // CONTROLADOR DE ACESSO
              'dataCadastro'
            ])),
            user_id: request.user_id // guardando usuário logado no bando de dados.
          }

          /* Procurando id do evento através do nome para salvar no banco */
          const { nomeEvento } = request.all()
          const evento = await Evento.findBy('nomeSite', nomeEvento)

          // Checando se email já existe...
          const searchEmail = await User.findBy('email', data.email)
          if (searchEmail) {
            return response.status(401).send({ message: 'Email já existe!' })
          }

          // Verifica se campo telefone está correto.
          if (data.celPhone.length < 14) {
            return response.status(400).send({ message: 'Campo celular inválido, verifique o tamanho.' })
          }

          const user = await User.create(data)

          /** Toda vez que se cria um controlador de acessso é preciso gerar automaticamente
          dados na tabela (evento_controle_acesso) **/
          const controladorAcc = new EventoControladorAcesso()
          controladorAcc.evento_id = evento.id // grupo do comissário
          controladorAcc.status = 'ativo' // id do comissário
          controladorAcc.user_id = user.user_id // id de quem criou
          controladorAcc.controladorAcesso_id = user.id // id de quem criou
          await controladorAcc.save()

          return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
        }
        return response.status(401).send({ message: 'INATIVO!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // -------------------------------------------------------------------------//

  async index (page, pageSize) { // Busca todos usuários
    const data =
    await User.query()
      .orderBy('name')
      .where('status', 'ativo')
      .where('permission', 'controle acesso')
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
        return response.status(401).json({ message: 'token invalido' })
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
              'status',
              'permission', // CONTROLADOR DE ACESSO
              'user_id'
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
        }
        return response.status(401).send({ message: 'Administrador Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
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

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo e se não for ele mesmo
        if (userRegister.status.toLowerCase() === 'ativo' && user.id !== userRegister.id) {
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
        }
        return response.status(401).send({ message: 'Não pode se excluir ou está Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
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
        console.log('name')
        const data =
          await User.query()
            .orderBy('name')
            .where('name', 'like', name + '%')
            .where('status', 'ativo')
            .where('permission', 'controle acesso')
            .paginate(page, pageSize)
        return data
      }
      if (name === '') {
        const data =
          await User.query()
            .orderBy('name')
            .where('status', 'ativo')
            .where('permission', 'controle acesso')
            .paginate(page, pageSize)
        return data
      }
    } catch (error) {
      return response.status(400).send({ message: 'Usuário não encontrado' })
    }
  }
}

module.exports = ControladorAcessoController
