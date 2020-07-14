'use strict'

const Route = use('Route')

Route.post('amounts', 'ContasPagar/ContasPagarController.store')
  .middleware(['auth', 'auditoria'])

Route.put('amounts/:id', 'ContasPagar/ContasPagarController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('amounts/:id', 'ContasPagar/ContasPagarController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('amounts', 'ContasPagar/ContasPagarController.index')

Route.get('amounts/:id', 'ContasPagar/ContasPagarController.show')
