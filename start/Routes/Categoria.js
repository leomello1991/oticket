'use strict'

const Route = use('Route')

Route.post('categorias', 'Categoria/CategoriaController.store')
  .middleware(['auth', 'auditoria'])

Route.put('categorias/:id', 'Categoria/CategoriaController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('categorias/:id', 'Categoria/CategoriaController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('categorias', 'Categoria/CategoriaController.index')

Route.get('categorias/:id', 'Categoria/CategoriaController.show')
