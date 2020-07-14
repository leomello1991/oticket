'use strict'

const Route = use('Route')

Route.post('sangrias', 'Sangria/LogSangriaController.store')
  .middleware(['auth', 'auditoria'])

Route.put('sangrias/:id', 'Sangria/LogSangriaController.cancelSangria')
  .middleware(['auth', 'auditoria'])

Route.get('sangrias', 'Sangria/LogSangriaController.showSangria')
  .middleware(['auth'])
