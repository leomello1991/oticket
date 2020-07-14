'use strict'

const Route = use('Route')

Route.get('eventoControladorAcc', 'Evento/EventoControladorAcessoController.index')

Route.delete('eventoControladorAcc/:id', 'Evento/EventoControladorAcessoController.destroy')
  .middleware(['auth'])

Route.put('eventoControladorAcessos', 'Evento/EventoControladorAcessoController.update')
  .middleware(['auth', 'auditoria']) // ADM

Route.get('showEventControladores', 'Evento/EventoControladorAcessoController.showEventControladores').middleware(['auth']) // ADM
