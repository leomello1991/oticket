'use strict'

const Route = use('Route')

Route.get('eventoComissarios', 'Evento/EventoComissarioController.index')

Route.delete('eventoComissarios/:id', 'Evento/EventoComissarioController.destroy')
  .middleware(['auth'])

Route.put('eventoComissarios/:id', 'Evento/EventoComissarioController.destroy')
  .middleware(['auth'])

Route.put('eventoComissarios', 'Evento/EventoComissarioController.update')
  .middleware(['auth', 'auditoria']) // ADM

Route.get('showEventComissarios', 'Evento/EventoComissarioController.showEventComissarios').middleware(['auth']) // ADM
