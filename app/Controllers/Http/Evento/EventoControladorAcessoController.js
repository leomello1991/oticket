'use strict'

const EventoControladorAcesso = use('App/Models/EventoControladorAcesso')
const Database = use('Database')
const User = use('App/Models/User')
const Exceptions = require('../../../Exceptions/CustomException')

class EventoControladorAcessoController {
  async store ({ request, response }) {
    /** Dados inseridos na hora de cadastrar o usuário Controlador de Acesso */
  }

  // ------------------------------------------------------------------------ //

  /* ADM
  Esta função faz o update na tabela evento_ontrolador_acessos, o usuário pode
  adicionar ou remover o(s) controlador(es) de acesso de um determinado evento.
  -> route: eventoControladorAcessos
  */
  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      /* Front manda eventoID e Nome(s) do(s) controlador(es) que será alterado */
      const { eventoId, newControls, oldControls, status } = request.all()

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo
        if (userRegister.status.toLowerCase() === 'ativo') {
          if (oldControls) {
            const oldControl = oldControls.split(' ')
            /* Deleta Produtores selecionados pelo usuário */
            for (let i = 0; i < oldControl.length; i++) {
              /* Transformo o nome do antigo produtor em id pra procurar no banco */
              const controlador = await User
                .query()
                .where('permission', 'controle acesso')
                .where('name', oldControl[i])
                .first()

              await Database
                .table('evento_controlador_acessos')
                .where('controladorAcesso_id', controlador.id)
                .where('evento_id', eventoId)
                .delete()
            }
          }

          if (newControls) {
            const newControl = newControls.split(' ')
            /* Insere Produtores selecionados pelo usuário */
            for (let i = 0; i < newControl.length; i++) {
              /* Transformo o nome do produtor em id pra procurar no banco */
              const controlador = await User
                .query()
                .where('permission', 'controle acesso')
                .where('name', newControl[i])
                .first()

              /* Primeiro procurar no banco se já tem produtor relacionado com
              esse evento */
              const verifyControl = await EventoControladorAcesso
                .query()
                .where('controladorAcesso_id', controlador.id)
                .where('evento_id', eventoId)
                .first()

              if (verifyControl) {
                return response.status(400).send({ message: 'Usuário já cadastrado nesse evento.' })
              }

              /* Apenas adiciona produtores que não estão na tabela */
              if (verifyControl === null) {
                await Database
                  .table('evento_controlador_acessos')
                  .insert({
                    evento_id: eventoId,
                    user_id: request.user_id,
                    controladorAcesso_id: controlador.id,
                    status: status.toLowerCase(),
                    created_at: new Date(),
                    updated_at: new Date()
                  })
              }
            }
          }
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

  // ------------------------------------------------------------------------ //

  async destroy ({ params, request, response, auth }) {
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const evento = await EventoControladorAcesso.findOrFail(request.params.id)

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Usuário Logado
      const userRegister = await auth.getUser()

      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo e se não for ele mesmo
        if (userRegister.status.toLowerCase() === 'ativo') {
          await evento.delete()
          return response.status(201).send({ sucess: 'Dados removidos com sucesso' })
        }
        return response.status(401).send({ message: 'Inativo!' })
      }
      return response.status(401).send({ message: 'Permissão negada!' })
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async index ({ request, response, view }) {
    const data = await EventoControladorAcesso.query().fetch()
    return data
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Carrega a lista de relacionamentos entre eventos e produtores a partir
  do id do evento. Route: showEventControladores
  */
  async showEventControladores ({ request, response, view }) {
    const { eventoId } = request.all()
    const eventos = await EventoControladorAcesso
      .query()
      .where('evento_id', eventoId)
      .paginate()
    return eventos
  }
}

module.exports = EventoControladorAcessoController
