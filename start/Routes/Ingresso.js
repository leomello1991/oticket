'use strict'

const Route = use('Route')

Route.post('ingressos', 'Ingresso/IngressoController.store')
  .middleware(['auth', 'auditoria'])

Route.put('ingressos/:id', 'Ingresso/IngressoController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('ingressos/:id', 'Ingresso/IngressoController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('ingressos', 'Ingresso/IngressoController.index')

Route.get('ingressos/:id', 'Ingresso/IngressoController.show')

Route.get('showTickets', 'Ingresso/IngressoController.showTickets')
  .middleware(['auth'])

Route.get('myTickets', 'Ingresso/IngressoController.myTickets') // Meus Ingressos - SITE

Route.get('showTicketsCPF', 'Ingresso/IngressoController.showTicketsCPF')
  .middleware(['auth'])// ADM - Mostra ingressos de um cliente
