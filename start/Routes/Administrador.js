'use strict'

const Route = use('Route')

Route.post('usersAdministrador', 'Usuarios/Administrador/AdministradorController.store')
  .middleware(['auth', 'auditoria'])

Route.put('usersAdministrador/:id', 'Usuarios/Administrador/AdministradorController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeAdministrador/:id', 'Usuarios/Administrador/AdministradorController.destroy')
  .middleware(['auth'])

Route.get('usersAdministrador', 'Usuarios/Administrador/AdministradorController.index')

Route.get('filterUsersAdministrador', 'Usuarios/Administrador/AdministradorController.show')
