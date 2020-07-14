'use strict'

const Route = use('Route')

// Quando um Comissário cadastra um cliente no aplicativo
Route.post('usersIntermediate', 'Usuarios/Cliente/UserController.storeIntermediate')
  .middleware(['auth', 'auditoria'])

// Quando um cliente se cadastra - Não possui token
Route.post('usersNew', 'Usuarios/Cliente/UserController.storeNew')

Route.put('users/:id', 'Usuarios/Cliente/UserController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeUser/:id', 'Usuarios/Cliente/UserController.destroy')
  .middleware(['auth'])

Route.get('users', 'Usuarios/Cliente/UserController.index')

Route.get('filterUsers', 'Usuarios/Cliente/UserController.show')
  .middleware(['auth'])

Route.get('users/:id', 'Usuarios/Cliente/UserController.showUser')
  .middleware(['auth'])

Route.get('search/:id', 'Usuarios/Cliente/UserController.searchCard')
  .middleware(['auth'])
