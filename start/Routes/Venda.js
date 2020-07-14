'use strict'

const Route = use('Route')

/* SITE - vendas: Faz a venda na parte do cliente */
Route.post('vendas', 'Vendas/VendaController.store')
  .middleware(['auth', 'auditoria'])

Route.put('vendas/:id', 'Vendas/VendaController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('vendas/:id', 'Vendas/VendaController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('vendas', 'Vendas/VendaController.index')

Route.get('vendas/:id', 'Vendas/VendaController.show')

Route.get('salesAdm', 'Vendas/VendaController.salesAdm')
  .middleware(['auth']) // ADM
