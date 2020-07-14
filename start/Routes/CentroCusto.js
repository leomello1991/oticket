'use strict'

const Route = use('Route')

Route.post('costs', 'CentroCusto/CentroCustoController.store')
  .middleware(['auth', 'auditoria'])

Route.put('costs/:id', 'CentroCusto/CentroCustoController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('costs/:id', 'CentroCusto/CentroCustoController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('costs', 'CentroCusto/CentroCustoController.index')

Route.get('costs/:id', 'CentroCusto/CentroCustoController.show')
