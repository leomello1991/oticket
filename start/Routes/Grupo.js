'use strict'

const Route = use('Route')

Route.post('grupos', 'Grupo/GrupoController.store')
  .middleware(['auth', 'auditoria'])

Route.put('grupos/:id', 'Grupo/GrupoController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('grupos/:id', 'Grupo/GrupoController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('grupos', 'Grupo/GrupoController.index')

Route.get('grupos/:id', 'Grupo/GrupoController.show')
