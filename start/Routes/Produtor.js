'use strict'

const Route = use('Route')

Route.post('usersProdutor', 'Usuarios/Produtor/ProdutorController.store')
  .middleware(['auth', 'auditoria'])

Route.put('usersProdutor/:id', 'Usuarios/Produtor/ProdutorController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeProdutor/:id', 'Usuarios/Produtor/ProdutorController.destroy')
  .middleware(['auth'])

Route.get('usersProdutor', 'Usuarios/Produtor/ProdutorController.index')

Route.get('filterUsersProdutor', 'Usuarios/Produtor/ProdutorController.show')

Route.get('showProdutor', 'Usuarios/Produtor/ProdutorController.showProdutor')
