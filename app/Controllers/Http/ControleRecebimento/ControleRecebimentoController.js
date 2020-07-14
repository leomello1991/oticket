'use strict'

const Exceptions = require('../../../Exceptions/CustomException')
const moment = require('moment')
const User = use('App/Models/User')
const Evento = use('App/Models/Evento')
const Database = use('Database')

class ControleRecebimentoController {
/*
  -> Route: recebimentos
  -> Filtro: evento, comissário
  -> Usuários: Adm, Produtor, Comissário
  -> Mostra dados do ingressos vendidos
*/
  async ControleRecebimento ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const userRegister = await auth.getUser()

      const { page, pageSize, event, comissary } = request.get()

      /* Buscando ID do Evento pelo nome */
      const searchEvent = await Evento
      .query()
      .where('nomeSite', event)
      .first()

      /* Tratando caso evento não exista */
      if((event) && (searchEvent === null)){
        return response.status(401).send({ message: 'Evento não encontrado!' })
      }

      /* Buscando ID do Comissario pelo nome */
      const searchComissary = await User
        .query()
        .where('name', comissary)
        .whereIn('permission',['comissario', 'sub comissario'])
        .first()

      /* Tratando caso evento não exista */
      if((comissary) && (searchComissary === null)){
      return response.status(401).send({ message: 'Usuário não encontrado!' })
      }

      /* PERMISSÃO ADMINISTRADOR OU PRODUTOR*/
      if ((userRegister.permission.toLowerCase() === 'administrador') ||
      (userRegister.permission.toLowerCase() === 'produtor')) {

        /* Filtro por nome do Evento */
        if ((event) && (comissary === '')) {
          console.log('entrou - event')
          const venda = await Database
            .table('ingressos as i')
            .innerJoin('vendas as v', 'v.id', 'i.venda_id')
            .innerJoin('eventos as e', 'e.id', 'i.evento_id')
            // .innerJoin('users as u', 'u.id', 'v.comissario_id')
            .select(
              'i.data as dateSale',
              'v.id as saleID',
              'v.qtdeTotal as totalAmount',
              'v.meioPagamento as paymentMethod',
              'v.situacao as situation',
              'i.valor as valueTicket',
              'e.nomeSite as event',
              'i.comissario_id as comissary'
            )
            .where('i.evento_id', searchEvent.id)
            .paginate(page, pageSize)

            /* Resposta caso dados não sejam encontrados */
            if (venda.total === '0') {
              return response.status(400).send({ message: 'Nenhum dado encontrado!' })
            }  

          return venda
        }        
 
        /* Filtro nome de comissário */
        if ((comissary) && (event === '')){
          console.log('entrou - comissary')
          
          const venda = await Database
            .from('ingressos as i')
            .innerJoin('vendas as v', 'v.id', 'i.venda_id')
            .innerJoin('lotes as l', 'l.id', 'i.lote_id')
            .innerJoin('eventos as e', 'e.id', 'i.evento_id')
            .innerJoin('users as u', 'u.id', 'v.comissario_id')
            .select(
              'i.data as dateSale',
              'v.id as saleID',
              'v.qtdeTotal as totalAmount',
              'v.meioPagamento as paymentMethod',
              'v.situacao as situation',
              'i.valor as valueTicket',
              'e.nomeSite as event',
              'u.name as comissary'
            )
            .where('i.comissario_id', searchComissary.id)
            .paginate(page, pageSize)

            /* Resposta caso dados não sejam encontrados */
            if (venda.total === '0') {
              return response.status(400).send({ message: 'Nenhum dado encontrado!' })
            }  

          return venda
        }
        /* Filtro nome de comissário */
        if ((comissary) && (event)) {
          console.log('entrou - comissary, event')
          const searchComissary = await User
            .query()
            .where('name', comissary)
            .where('permission', 'comissario')
            .first()

          const searchEvent = await Evento
          .query()
          .where('nomeSite', event)
          .first()
 
          const venda = await Database
            .from('ingressos as i')
            .innerJoin('vendas as v', 'v.id', 'i.venda_id')
            .innerJoin('lotes as l', 'l.id', 'i.lote_id')
            .innerJoin('eventos as e', 'e.id', 'i.evento_id')
            .innerJoin('users as u', 'u.id', 'v.comissario_id')
            .select(
              'i.data as dateSale',
              'v.id as saleID',
              'v.qtdeTotal as totalAmount',
              'v.meioPagamento as paymentMethod',
              'v.situacao as situation',
              'i.valor as valueTicket',
              'e.nomeSite as event',
              'u.name as comissary'
            )
            .where('i.comissario_id', searchComissary.id)
            .where('i.evento_id', searchEvent.id)
            .paginate(page, pageSize)
          
            /* Resposta caso dados não sejam encontrados */
            if (venda.total === '0') {
              return response.status(400).send({ message: 'Nenhum dado encontrado!' })
            }    
          return venda
        }
      }
      /* PERMISSÃO COMISSÀRIO */
      if ((userRegister.permission.toLowerCase() === 'comissario') ||
      (userRegister.permission.toLowerCase() === 'sub comissario')){

        console.log('Permissão: '+userRegister.permission)

        /* Filtro por nome do Evento e token Comissário*/
        if ((event) && (comissary === '')) {
          console.log('Comissario entrou - Event')
          const venda = await Database
          .table('ingressos as i')
          .innerJoin('vendas as v', 'v.id', 'i.venda_id')
          .innerJoin('eventos as e', 'e.id', 'i.evento_id')
          .innerJoin('users as u', 'u.id', 'v.comissario_id')
          .select(
            'i.data as dateSale',
            'v.id as saleID',
            'v.qtdeTotal as totalAmount',
            'v.meioPagamento as paymentMethod',
            'v.situacao as situation',
            'i.valor as valueTicket',
            'e.nomeSite as event',
            'u.name as comissary'
          )
          .where('i.evento_id', searchEvent.id)
          .where('i.comissario_id', userRegister.id)
          .paginate(page, pageSize)

          const teste = await User
          .query()
          .where('comissario_id', userRegister.id)
          .ids()
          console.log('Sub Comissarios pertencem: '+ teste)

          /* Resposta caso dados não sejam encontrados */
          if (venda.total === '0') {
            return response.status(400).send({ message: 'Nenhum dado encontrado!' })
          } 
          return venda
        }      
        /* Filtra todos por Token de Comissário */
        if ((event === '') && (comissary === '')) {
          console.log('Comissario entrou - Event:null')
          const venda = await Database
          .table('ingressos as i')
          .innerJoin('vendas as v', 'v.id', 'i.venda_id')
          .innerJoin('eventos as e', 'e.id', 'i.evento_id')
          .innerJoin('users as u', 'u.id', 'v.comissario_id')
          .select(
              'i.data as dateSale',
              'v.id as saleID',
              'v.qtdeTotal as totalAmount',
              'v.meioPagamento as paymentMethod',
              'v.situacao as situation',
              'i.valor as valueTicket',
              'e.nomeSite as event',
              'u.name as comissary'
            )
          .where('i.comissario_id', userRegister.id)
          .paginate(page, pageSize)

          /* Buscando sub comissarios de um comissario para mostrar suas vendas */
          const teste = await User
          .query()
          .where('comissario_id', userRegister.id)
          .ids()
          console.log('Sub Comissarios pertencem: '+ teste)

          
  
          /* Resposta caso dados não sejam encontrados */
          if (venda.total === '0') {
            return response.status(400).send({ message: 'Nenhum dado encontrado!' })
          }  
          return venda
        }       
      }else {
      return response.status(401).send({ message: 'Permissão negada!'})
      }
    }catch(error){
      const message = Exceptions.errorVerify(error)
      response.send({ message })
    } 
  }

  /****************************************************************************/

  /*
  -> Route: totalVendaRecebimentos
  -> Mostra o total de vendas de um evento ou comissário.
  */
  async totalVendaRecebimentos(){
    try {
      const verifyToken = await auth.check() // Checando token

      if (!verifyToken) {
        return response.status(401).send({ message: 'Token invalido' })
      }

      const userRegister = await auth.getUser()

      const { page, pageSize, eventName, comissary } = request.get()

      /* Procurando pelo ID do evento */
      const eventId = await Evento
      .query()
      .where('nomeSite', 'like', eventName.toLowerCase() + '%')
      .first()

      /* Tratando caso evento não exista */
      if((eventName) && (eventId === null)){
        return response.status(401).send({ message: 'Evento não encontrado!' })
      }

      if (userRegister.permission.toLowerCase() === 'administrador') {
        if (eventId){
          console.log('aki')
        }
      }
      else{
        return response.status(401).send({ message: 'Permissão negada!'})
      }
    }catch(error){
      const message = Exceptions.errorVerify(error)
      response.send({ message })
    }
  }
}

module.exports = ControleRecebimentoController
