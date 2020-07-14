'use strict'

const EventoProdutore = use('App/Models/EventoProdutore')
const Database = use('Database')
const User = use('App/Models/User')
const Exceptions = require('../../../Exceptions/CustomException')

class EventoProdutoreController {
  async store ({ request, response }) {
    /** Dados inseridos na hora de criar o evento */
  }

  // -------------------------------------------------------------------------- //

  /* ADM
  Esta função faz o update na tabela evento_produtortes, o usuário pode adicionar
  ou remover o produtor de um determinado evento.
  -> Route: eventoProdutores
  */
  async update ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      /* Front manda eventoID e Nome(s) do(s) produtor(es) que será alterado */
      const { eventoId, newProdutores, oldProdutores } = request.all()

      console.log(eventoId)
      console.log(newProdutores)
      console.log(oldProdutores)

      // Se for ADMINISTRADOR
      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (userRegister.status.toLowerCase() === 'ativo') {
          if (oldProdutores) {
            console.log('Entrou Old')

            const oldProdutor = oldProdutores.split(' ')
            /* Deleta Produtores selecionados pelo usuário */
            for (let i = 0; i < oldProdutor.length; i++) {
              /* Transformo o nome do antigo produtor em id pra procurar no banco */
              const produtor = await User
                .query()
                .where('permission', 'produtor')
                .where('name', oldProdutor[i])
                .first()

              console.log('produtor: ' + oldProdutor[i])
              console.log(produtor.id)

              await Database
                .table('evento_produtores')
                .where('produtor_id', produtor.id)
                .where('evento_id', eventoId)
                .delete()
            }
          }

          if (newProdutores) {
            console.log('Entrou New')

            const newProdutor = newProdutores.split(' ')
            /* Insere Produtores selecionados pelo usuário */
            for (let i = 0; i < newProdutor.length; i++) {
              /* Transformo o nome do produtor em id pra procurar no banco */
              const produtor = await User
                .query()
                .where('permission', 'produtor')
                .where('name', newProdutor[i])
                .first()
              console.log(produtor.id)

              /* Primeiro procurar no banco se já tem produtor relacionado com
              esse evento */
              const verifyProdutor = await EventoProdutore
                .query()
                .where('produtor_id', produtor.id)
                .where('evento_id', eventoId)
                .first()

              console.log('verifica: ' + verifyProdutor)

              if (verifyProdutor) {
                return response.json('Já existe')
              }

              /* Apenas adiciona produtores que não estão na tabela */
              if (verifyProdutor === null) {
                console.log('Não existe')
                await Database
                  .table('evento_produtores')
                  .insert({
                    evento_id: eventoId,
                    user_id: request.user_id,
                    produtor_id: produtor.id,
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

  // -------------------------------------------------------------------------- //
  async destroy ({ params, request, response, auth }) {
    const verifyToken = await auth.check() // Checando token
    try {
      // Realizando busca de ID
      const evento = await EventoProdutore.findOrFail(request.params.id)

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
    const eventos = await EventoProdutore.query().fetch()
    return eventos
  }

  // ------------------------------------------------------------------------ //

  async show ({ request, response, view }) {
  }

  // ------------------------------------------------------------------------ //

  /* ADM - Carrega a lista de relacionamentos entre eventos e produtores a partir
  do id do evento. Route: showEventProdutores
  */
  async showEventProdutores ({ request, response, view }) {
    const { eventoId } = request.all()
    const eventos = await EventoProdutore
      .query()
      .where('evento_id', eventoId)
      .paginate()
    return eventos
  }

// -------------------------------------------------------------------------- //
}
module.exports = EventoProdutoreController
