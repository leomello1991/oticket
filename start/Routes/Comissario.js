'use strict'

const Route = use('Route')

Route.post('usersComissario', 'Usuarios/Comissario/ComissarioController.store')
  .middleware(['auth', 'auditoria'])

Route.put('usersComissario/:id', 'Usuarios/Comissario/ComissarioController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeComissario/:id', 'Usuarios/Comissario/ComissarioController.destroy')
  .middleware(['auth'])

Route.get('usersComissario', 'Usuarios/Comissario/ComissarioController.index')

Route.get('filterUsersComissario', 'Usuarios/Comissario/ComissarioController.show')

/* Mostra os comissarios para qdo é cadastro de Sub Comissarios - CAIO */
Route.get('showComissarios', 'Usuarios/Comissario/ComissarioController.showComissarios')
