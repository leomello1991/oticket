'use strict'

const Route = use('Route')

Route.post('eventos', 'Evento/EventoController.store')
  .middleware(['auth', 'auditoria'])

Route.put('eventos/:id', 'Evento/EventoController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('eventos/:id', 'Evento/EventoController.destroy')
  .middleware(['auth'])

Route.get('eventos', 'Evento/EventoController.index')

Route.get('eventosOnly', 'Evento/EventoController.destroyOnly')

Route.put('updateImageIngresso/:id', 'Evento/EventoController.updateImageIngresso')

Route.put('updateImageHome/:id', 'Evento/EventoController.updateImageHome')

Route.get('filterEvents', 'Evento/EventoController.filterEvent') /* SITE */

Route.get('showEvents', 'Evento/EventoController.show') /* Filtra/Mostra todos os eventos ativos - SITE home */

Route.get('showEventID/:id', 'Evento/EventoController.showEventID') /* ADM */
