'use strict'

const Route = use('Route')

Route.post('expenses', 'Despesa/DespesaController.store')
  .middleware(['auth', 'auditoria'])

Route.put('expenses/:id', 'Despesa/DespesaController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('expenses/:id', 'Despesa/DespesaController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('expenses', 'Despesa/DespesaController.index')

Route.get('expenses/:id', 'Despesa/DespesaController.show')
