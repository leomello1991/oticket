'use strict'

const Route = use('Route')

Route.post('salesComissary', 'Vendas/VendaComissarioController.store')
  .middleware(['auth', 'auditoria'])

Route.get('salesComissary', 'Vendas/VendaComissarioController.salesComissary')
  .middleware(['auth'])// ADM
