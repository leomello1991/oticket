'use strict'

const Route = use('Route')

Route.post('vendaItens', 'Vendas/VendaItemController.store')
  .middleware(['auth', 'auditoria'])

Route.put('vendaItens/:id', 'Vendas/VendaItemController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('vendaItens/:id', 'Vendas/VendaItemController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('vendaItens', 'Vendas/VendaItemController.index')

Route.get('vendaItens/:id', 'Vendas/VendaItemController.show')
