'use strict'

const Route = use('Route')

/*  SaveProductorComissaryController  */
Route.post('testeArray', 'Testes/SaveProductorComissaryController.main')
/*  SaveProductorComissaryController  */

/*  TestesController  */
Route.post('testes', 'TestesController.buyTickets')
  .middleware(['auth', 'auditoria'])

// Mostra eventos que estão ativos e seus lotes.
Route.get('eventsHome', 'Testes/TestesController.showEventsWithLotes')

// Mostra os lotes ativos de um evento
Route.get('mostraLotes', 'EventoController.mostraLotesAtivos')

Route.get('teste/:id', 'IngressoController.testeMostraIngresso')

Route.get('array', 'testeMostraDadoController.testeArray')

Route.get('buyTickets', 'Testes/TestesController.buyTickets')
  .middleware(['auth', 'auditoria'])

Route.get('showUser/:id', 'Testes/TestesController.showUser')

/* Teste de formato de data */
Route.post('testFormatDate', 'Testes/TestesController.testFormatDate')

Route.get('a', 'Testes/TestesController.a')

// Teste de conexão entre controllers
Route.get('conexao', 'Testes/SaveProductorComissaryController.ENVIAconexoesController')
