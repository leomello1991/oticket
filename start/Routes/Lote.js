'use strict'

const Route = use('Route')

Route.get('lotes/:id', 'Lote/LoteController.show')

Route.post('lotes', 'Lote/LoteController.store')
  .middleware(['auth', 'auditoria'])

Route.put('lotes/:id', 'Lote/LoteController.update')
  .middleware(['auth', 'auditoria'])

Route.delete('lotes/:id', 'Lote/LoteController.destroy')
  .middleware(['auth', 'auditoria'])

/* ADM - Deleta o lote e carrega a lista dos lotes ativos do evento passado como parametro para (indexEventLote) */
Route.delete('deleteEventLotes/:id', 'Lote/LoteController.deleteEventLotes')
  .middleware(['auth', 'auditoria'])

/* ADM - Carrega a lista dos lotes ativos do evento passado pela função (deleteEventLotes) */
Route.delete('indexEventLotes/:id', 'Lote/LoteController.indexEventLotes')
  .middleware(['auth', 'auditoria'])

/* ADM - Mostra todos os LOTES (ativo e inativo) a partir do nome do Evento - ADM */
Route.get('lotes', 'Lote/LoteController.index')

/* ADM - Mostra os lotes a partir do nome do EVENTO */
Route.get('showEventLotes', 'Lote/LoteController.showLotesADM')

// SITE - Mostra os lotes a partir do id do EVENTO - SITE
Route.get('showLotes/:id', 'Lote/LoteController.showLotes')
