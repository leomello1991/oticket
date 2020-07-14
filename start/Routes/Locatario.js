'use strict'

const Route = use('Route')

Route.post('usersLocatario', 'LocatarioController.store')
  .middleware(['auth', 'auditoria']) // ADM

Route.put('usersLocatario/:id', 'LocatarioController.update')
  .middleware(['auth', 'auditoria']) // ADM

Route.put('inativeLocatario/:id', 'LocatarioController.inative')
  .middleware(['auth', 'auditoria']) // ADM

Route.get('showAllLocatarios', 'LocatarioController.showAllLocatarios') // ADM

Route.get('showLocatario', 'LocatarioController.showLocatario') // ADM

Route.get('showPontoVenda', 'LocatarioController.showPontoVenda') // ADM

Route.delete('usersDeleteLocatario/:id', 'LocatarioController.destroy')
  .middleware(['auth']) // BACK

Route.get('usersLocatario', 'LocatarioController.index')
