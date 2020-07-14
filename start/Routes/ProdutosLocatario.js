'use strict'

const Route = use('Route')

Route.post('products', 'ProdutosLocatarioController.store')
  .middleware(['auth', 'auditoria']) // ADM

Route.put('products/:id', 'ProdutosLocatarioController.update')
  .middleware(['auth', 'auditoria']) // ADM

Route.delete('products/:id', 'ProdutosLocatarioController.destroy')
  .middleware(['auth', 'auditoria'])// ADM

Route.get('showAllProducts', 'ProdutosLocatarioController.showAllProducts') // ADM

Route.get('showProduct', 'ProdutosLocatarioController.showProduct') // ADM
