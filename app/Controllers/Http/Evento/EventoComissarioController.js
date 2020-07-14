'use strict'

const EventoComissario = use('App/Models/EventoComissario')
const User = use('App/Models/User')
const Grupo = use('App/Models/Grupo')
const Exceptions = require('../../../Exceptions/CustomException')
const Database = use('Database')

class EventoComissarioController {
  // Função de relação do EVENTO com o COMISSÁRIO

  async store ({ request, response, auth }) {
    /** A função de cadastro está sendo feita no EventoController pois depende
    do evento para ser criada */
  }

  // ------------------------------------------------------------------------ //

  /* ADM
  Esta função faz o update na tabela evento_comissarios, o usuário pode
  adicionar ou remover o comissario de um determinado evento.
  -> Route: eventoComissarios
  */
  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      /* Front manda eventoID e Nome(s) do(s) comissario(os) que serão alterado */
      const { eventoId, newComissarios, newGroups, oldComissarios, status } = request.all()

      console.log(eventoId)
      console.log(newComissarios)
      console.log(oldComissarios)
      console.log(newGroups)

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        // Se estiver ativo
        if (userRegister.status.toLowerCase() === 'ativo') {
          if (oldComissarios) {
            console.log('Entrou Old')
            const oldComissario = oldComissarios.split(' ')

            /* Deleta Comissarios selecionados pelo usuário */
            for (let i = 0; i < oldComissario.length; i++) {
              /* Transformo o nome do antigo comissario em id pra procurar no banco */
              const comissario = await User
                .query()
                .where('permission', 'comissario')
                .where('name', oldComissario[i])
                .first()

              console.log('comissario: ' + oldComissario[i])
              console.log(comissario.id)

              await Database
                .table('evento_comissarios')
                .where('comissario_id', comissario.id)
                .where('evento_id', eventoId)
                .delete()
            }
          }

          if (newComissarios) {
            console.log('Entrou New')

            const newComissario = newComissarios.split(' ')
            const newGroup = newGroups.split(' ')

            /* Insere Comissarios e os grupos selecionados pelo usuário */
            for (let i = 0; i < newComissario.length; i++) {
              console.log('entrou for ' + newComissario[i])

              /* Transformo o nome do comissario em id pra procurar no banco */
              const comissario = await User
                .query()
                .where('permission', 'comissario')
                .where('name', newComissario[i])
                .first()
              console.log(comissario.id)

              /* Transformo o nome do grupo em id pra procurar no banco */
              const grupo = await Grupo
                .query()
                .where('descricao', newGroup[i])
                .first()
              console.log(grupo.id)

              /* Primeiro procurar no banco se já tem produtor relacionado com
              esse evento */
              const verifyComissario = await EventoComissario
                .query()
                .where('comissario_id', comissario.id)
                .where('evento_id', eventoId)
                .first()

              console.log('verifica: ' + verifyComissario)

              if (verifyComissario) {
                return response.json('Já existe')
              }

              /* Apenas adiciona produtores que não estão na tabela */
              if (verifyComissario === null) {
                console.log('Não existe')
                await Database
                  .table('evento_comissarios')
                  .insert({
                    evento_id: eventoId,
                    user_id: request.user_id,
                    comissario_id: comissario.id,
                    grupo_id: grupo.id,
                    status: status.toLowerCase(),
                    data: new Date(),
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
      const evento = await EventoComissario.findOrFail(request.params.id)

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
    const eventos = await EventoComissario.query().fetch()
    return eventos
  }

  // ------------------------------------------------------------------------ //

  async show ({ params, request, response, view }) {
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Carrega a lista de relacionamentos entre eventos e comissarios a
  partir do id do evento. Route: showEventComissarios
  */
  async showEventComissarios ({ request, response, view }) {
    const { eventoId } = request.all()
    const eventos = await EventoComissario
      .query()
      .where('evento_id', eventoId)
      .paginate()
    return eventos
  }
}

module.exports = EventoComissarioController
