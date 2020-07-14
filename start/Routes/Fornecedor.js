'use strict'

const Route = use('Route')

Route.post('usersFornecedor', 'Usuarios/Fornecedor/FornecedorController.store')
  .middleware(['auth', 'auditoria'])

Route.put('usersFornecedor/:id', 'Usuarios/Fornecedor/FornecedorController.update')
  .middleware(['auth', 'auditoria'])

Route.put('inativeFornecedor/:id', 'Usuarios/Fornecedor/FornecedorController.destroy')
  .middleware(['auth'])

Route.get('filterUsersFornecedor', 'Usuarios/Fornecedor/FornecedorController.show')
