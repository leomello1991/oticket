'use strict'

const Route = use('Route')

Route.post('usersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.store')
  .middleware(['auth', 'auditoria'])

Route.put('usersControladorAcesso/:id', 'Usuarios/ControladorAcesso/ControladorAcessoController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeControladorAcesso/:id', 'Usuarios/ControladorAcesso/ControladorAcessoController.destroy')
  .middleware(['auth'])

Route.get('usersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.index')

Route.get('filterUsersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.show')
