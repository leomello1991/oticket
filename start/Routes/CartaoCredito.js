'use strict'

const Route = use('Route')

Route.post('userCards', 'UserCard/UserCardController.store')
  .middleware(['auth'])

Route.put('userCards/:id', 'UserCard/UserCardController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('userCards/:id', 'UserCard/UserCardController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('userCards', 'UserCard/UserCardController.index')

Route.get('userCards/:id', 'UserCard/UserCardController.show')

Route.get('search/:id', 'UserCard/UserCardController.searchCard')
  .middleware(['auth'])
