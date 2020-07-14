'use strict'

const Route = use('Route')

Route.get('showTransferTickets', 'Ingresso/IngressoHistTransferenciaController.showTransferTickets')

// SITE -  Transferencia de Ingressos
Route.post('transferTickets', 'Ingresso/IngressoHistTransferenciaController.tranferTickets')
  .middleware(['auth'])
