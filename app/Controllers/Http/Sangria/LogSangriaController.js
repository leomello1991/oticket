'use strict'

const { Utils } = use('App/Helpers/Utils')
const { showSangriaAdministrator } = require('../../../Services/Sangrias/Administrator')
const { showSangriaProductor } = require('../../../Services/Sangrias/Productor')
const { showSangriaComissary } = require('../../../Services/Sangrias/Comissary')
const Evento = use('App/Models/Evento')
const User = use('App/Models/User')
const LogSangria = use('App/Models/LogSangria')
const Exceptions = require('../../../Exceptions/CustomException')

class LogSangriaController {
  async store ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      const userRegister = await auth.getUser()

      console.log(userRegister.permission)

      if (userRegister.permission === 'produtor') {
        const data = {
          ...Utils.convertJasonLowercase(request.only([
            'date',
            'hour',
            'value',
            'status',
            'evento_id',
            'administrador_id',
            'produtor_id',
            'comissario_id'
          ])),
          user_id: request.user_id
        }

        const searchComiss = await User.findBy('id', data.comissario_id)
        if (!searchComiss) {
          return response.status(401).send({ message: 'ID não encontrado!' })
        }

        if (searchComiss.permission !== 'comissario') {
          return response.status(401).send({ message: 'Este ID não pertence a um comissário!' })
        }

        const searchEvento = await Evento.findBy('id', data.evento_id)
        if (!searchEvento) {
          return response.status(401).send({ message: 'Evento não existe!' })
        }

        if (userRegister.permission === 'produtor') {
          data.produtor_id = userRegister.id
        }
        await LogSangria.create(data)
        return response.status(201).send({ message: 'Sangria cadastrada com sucesso!' })
      } else {
        return response.status(401).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  /****************************************************************************/
  /*
    -> Route: PUT/sangrias
    -> A pessoa que pode fazer alteração:
      -> Adm: pode fazer em qualquer momento
      -> Produtor: Só pode fazer alteração no Log que estiver cadastrado.
    */
  async cancelSangria ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      const userRegister = await auth.getUser()

      const sangria = await LogSangria.findOrFail(request.params.id)

      if ((userRegister.permission === 'produtor') && (userRegister.id === sangria.produtor_id)) {
        await LogSangria
          .query()
          .where('id', sangria.id)
          .update({
            status: 'cancelado',
            user_id: userRegister.id
          })
        return response.status(200).send({ message: 'Sangria cancelada!' })
      } else {
        return response.status(401).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  /*
  -> ADM
  -> Route: GET/sangrias
  -> Administrador: Tem acesso a todos os tipos de pesquisa:
    -> Todas as sangrias
    -> Por evento
    -> Por comissário
  -> Produtor: Tem acesso apenas às suas samgrias.
  -> Opções de visulização: all, active, canceled.
  */
  async showSangria ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'token invalido' })
      }

      const userRegister = await auth.getUser()

      const { page, pageSize, type, comissaryId, eventName } = request.get()

      console.log(page, pageSize, type, comissaryId, eventName)

      const eventId = await Evento
      .query()
      .where('nomeSite', eventName)
      .first()

      console.log('nomeEvento: '+eventId)

      /* Tratando caso evento não exista ou caso vá vazio */
      if((eventName) && (eventId === null)){
        return response.status(401).send({ message: 'Evento não encontrado!' })
      }
           

      /* Pesquisa de Sangria do Adm - Mostra todas as Sangrias no Sistema */
      if (userRegister.permission === 'administrador') {
        console.log('Entrou IF Adm')
        const aux = await showSangriaAdministrator(response, eventId, comissaryId, page, pageSize, type)
        return aux
      }

      /* Pesquisa de Sangria do Produtor - Mostra todas as Sangrias do Produtor */
      if (userRegister.permission === 'produtor') {
        console.log('Entrou IF Produtor')
        const aux = await showSangriaProductor(response, eventId, comissaryId, page, pageSize, type, userRegister.id)
        return aux
      }

      /* Pesquisa de Sangria do Comissario - Mostra todas as Sangrias do Comissario */
      if (userRegister.permission === 'comissario') {
        console.log('Entrou IF Comissario')
        console.log(eventId, comissaryId, page, pageSize, type, userRegister.id)
        const aux = await showSangriaComissary(response, eventId, comissaryId, page, pageSize, type, userRegister.id)
        return aux
      } else {
        return response.status(401).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.status(400).send({ message })
    }
  }

  /****************************************************************************/

  /*
  -> Mostra todas as Sangrias */
  async index () {
    const sangrias = await LogSangria.query().paginate()
    return sangrias
  }
}

module.exports = LogSangriaController
