'use strict'

const Route = use('Route')

Route.post('parametros', 'Parametro/ParametroController.store')
  .middleware(['auth', 'auditoria'])

Route.put('parametros/:id', 'Parametro/ParametroController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('parametros/:id', 'Parametro/ParametroController.destroy')
  .middleware(['auth', 'auditoria'])

Route.get('parametros', 'Parametro/ParametroController.index')

Route.get('parametros/:id', 'Parametro/ParametroController.show')
