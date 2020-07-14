'use strict'

const Route = use('Route')

Route.get('eventoProdutores', 'Evento/EventoProdutoreController.index')

Route.delete('eventoProdutores/:id', 'Evento/EventoProdutoreController.destroy')
  .middleware(['auth'])

Route.put('eventoProdutores', 'Evento/EventoProdutoreController.update')
  .middleware(['auth', 'auditoria']) // ADM

Route.get('showEventProdutores', 'Evento/EventoProdutoreController.showEventProdutores').middleware(['auth']) // ADM
