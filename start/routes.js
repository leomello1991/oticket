'use strict'

require('../start/Routes/Administrador')
require('../start/Routes/CartaoCredito')
require('../start/Routes/Categoria')
require('../start/Routes/CentroCusto')
require('../start/Routes/Cliente')
require('../start/Routes/Comissario')
require('../start/Routes/ContasPagar')
require('../start/Routes/ControladorAcesso')
require('../start/Routes/ControleRecebimento')
require('../start/Routes/Despesa')
require('../start/Routes/Evento')
require('../start/Routes/EventoComissario')
require('../start/Routes/EventoControladorAcesso')
require('../start/Routes/EventoProdutor')
require('../start/Routes/Filters')
require('../start/Routes/ForgotPassword')
require('../start/Routes/Fornecedor')
require('../start/Routes/Genero')
require('../start/Routes/Grupo')
require('../start/Routes/Ingresso')
require('../start/Routes/IngressoHistTransferencia')
require('../start/Routes/Locatario')
require('../start/Routes/Lote')
require('../start/Routes/PagSeguro')
require('../start/Routes/Parametro')
require('../start/Routes/Produtor')
require('../start/Routes/ProdutosLocatario')
require('../start/Routes/QrCode')
require('../start/Routes/Sangria')
require('../start/Routes/SendBilletLink')
require('../start/Routes/Session')
require('../start/Routes/Testes')
require('../start/Routes/Venda')
require('../start/Routes/VendaComissario')
require('../start/Routes/VendaItem')

// Route.post('usersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.store').middleware(['auth', 'auditoria'])
// Route.put('usersControladorAcesso/:id', 'Usuarios/ControladorAcesso/ControladorAcessoController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeControladorAcesso/:id', 'Usuarios/ControladorAcesso/ControladorAcessoController.destroy').middleware(['auth'])
// Route.get('usersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.index')
// Route.get('filterUsersControladorAcesso', 'Usuarios/ControladorAcesso/ControladorAcessoController.show')

// Route.post('usersAdministrador', 'Usuarios/Administrador/AdministradorController.store').middleware(['auth', 'auditoria'])
// Route.put('usersAdministrador/:id', 'Usuarios/Administrador/AdministradorController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeAdministrador/:id', 'Usuarios/Administrador/AdministradorController.destroy').middleware(['auth'])
// Route.get('usersAdministrador', 'Usuarios/Administrador/AdministradorController.index')
// Route.get('filterUsersAdministrador', 'Usuarios/Administrador/AdministradorController.show')

// Route.post('usersComissario', 'Usuarios/Comissario/ComissarioController.store').middleware(['auth', 'auditoria'])
// Route.put('usersComissario/:id', 'Usuarios/Comissario/ComissarioController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeComissario/:id', 'Usuarios/Comissario/ComissarioController.destroy').middleware(['auth'])
// Route.get('usersComissario', 'Usuarios/Comissario/ComissarioController.index')
// Route.get('filterUsersComissario', 'Usuarios/Comissario/ComissarioController.show')
// /* Mostra os comissarios para qdo é cadastro de Sub Comissarios - CAIO */
// Route.get('showComissarios', 'Usuarios/Comissario/ComissarioController.showComissarios')

// Route.post('usersProdutor', 'Usuarios/Produtor/ProdutorController.store').middleware(['auth', 'auditoria'])
// Route.put('usersProdutor/:id', 'Usuarios/Produtor/ProdutorController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeProdutor/:id', 'Usuarios/Produtor/ProdutorController.destroy').middleware(['auth'])
// Route.get('usersProdutor', 'Usuarios/Produtor/ProdutorController.index')
// Route.get('filterUsersProdutor', 'Usuarios/Produtor/ProdutorController.show')
// Route.get('showProdutor', 'Usuarios/Produtor/ProdutorController.showProdutor')

// Route.post('pagSeguro', 'PagSeguro/PagSeguroController.store')
// Route.get('pagSeguro', 'PagSeguro/PagSeguroController.index')

// Route.post('costs', 'CentroCusto/CentroCustoController.store').middleware(['auth', 'auditoria'])
// Route.put('costs/:id', 'CentroCusto/CentroCustoController.update').middleware(['auth', 'auditoria'])
// Route.delete('costs/:id', 'CentroCusto/CentroCustoController.destroy').middleware(['auth', 'auditoria'])
// Route.get('costs', 'CentroCusto/CentroCustoController.index')
// Route.get('costs/:id', 'CentroCusto/CentroCustoController.show')

// Route.post('expenses', 'Despesa/DespesaController.store').middleware(['auth', 'auditoria'])
// Route.put('expenses/:id', 'Despesa/DespesaController.update').middleware(['auth', 'auditoria'])
// Route.delete('expenses/:id', 'Despesa/DespesaController.destroy').middleware(['auth', 'auditoria'])
// Route.get('expenses', 'Despesa/DespesaController.index')
// Route.get('expenses/:id', 'Despesa/DespesaController.show')

// Route.post('amounts', 'ContasPagar/ContasPagarController.store').middleware(['auth', 'auditoria'])
// Route.put('amounts/:id', 'ContasPagar/ContasPagarController.update').middleware(['auth', 'auditoria'])
// Route.delete('amounts/:id', 'ContasPagar/ContasPagarController.destroy').middleware(['auth', 'auditoria'])
// Route.get('amounts', 'ContasPagar/ContasPagarController.index')
// Route.get('amounts/:id', 'ContasPagar/ContasPagarController.show')

// Route.get('recebimentos', 'ControleRecebimento/ControleRecebimentoController.ControleRecebimento')

// Route.post('sangrias', 'Sangria/LogSangriaController.store').middleware(['auth', 'auditoria'])
// Route.put('sangrias/:id', 'Sangria/LogSangriaController.cancelSangria').middleware(['auth', 'auditoria'])
// Route.get('sangrias', 'Sangria/LogSangriaController.showSangria').middleware(['auth'])

// // Quando um intermediário cadastra um cliente no aplicativo
// Route.post('usersIntermediate', 'Usuarios/Cliente/UserController.storeIntermediate').middleware(['auth', 'auditoria'])
// // Quando um cliente se cadastra - Não possui token
// Route.post('usersNew', 'Usuarios/Cliente/UserController.storeNew')
// Route.put('users/:id', 'Usuarios/Cliente/UserController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeUser/:id', 'Usuarios/Cliente/UserController.destroy').middleware(['auth'])
// Route.get('users', 'Usuarios/Cliente/UserController.index')
// Route.get('filterUsers', 'Usuarios/Cliente/UserController.show').middleware(['auth'])
// Route.get('users/:id', 'Usuarios/Cliente/UserController.showUser').middleware(['auth'])
// Route.get('search/:id', 'Usuarios/Cliente/UserController.searchCard').middleware(['auth'])

// Route.post('userCards', 'UserCard/UserCardController.store').middleware(['auth'])
// Route.put('userCards/:id', 'UserCard/UserCardController.update').middleware(['auth', 'auditoria'])
// Route.delete('userCards/:id', 'UserCard/UserCardController.destroy').middleware(['auth', 'auditoria'])
// Route.get('userCards', 'UserCard/UserCardController.index')
// Route.get('userCards/:id', 'UserCard/UserCardController.show')
// Route.get('search/:id', 'UserCard/UserCardController.searchCard').middleware(['auth'])

// Route.post('eventos', 'Evento/EventoController.store').middleware(['auth', 'auditoria'])
// Route.put('eventos/:id', 'Evento/EventoController.update').middleware(['auth', 'auditoria'])
// Route.delete('eventos/:id', 'Evento/EventoController.destroy').middleware(['auth'])
// Route.get('eventos', 'Evento/EventoController.index')
// Route.get('eventosOnly', 'Evento/EventoController.destroyOnly')
// Route.put('updateImageIngresso/:id', 'Evento/EventoController.updateImageIngresso')
// Route.put('updateImageHome/:id', 'Evento/EventoController.updateImageHome')
// Route.get('filterEvents', 'Evento/EventoController.filterEvent') /* SITE */
// Route.get('showEvents', 'Evento/EventoController.show') /* Filtra/Mostra todos os eventos ativos - SITE home */
// Route.get('showEventID/:id', 'Evento/EventoController.showEventID') /* ADM */

// Route.get('eventoComissarios', 'Evento/EventoComissarioController.index')
// Route.delete('eventoComissarios/:id', 'Evento/EventoComissarioController.destroy').middleware(['auth'])
// Route.put('eventoComissarios/:id', 'Evento/EventoComissarioController.destroy').middleware(['auth'])
// Route.put('eventoComissarios', 'Evento/EventoComissarioController.update').middleware(['auth', 'auditoria']) // ADM
// Route.get('showEventComissarios', 'Evento/EventoComissarioController.showEventComissarios').middleware(['auth']) // ADM

// Route.get('eventoControladorAcc', 'Evento/EventoControladorAcessoController.index')
// Route.delete('eventoControladorAcc/:id', 'Evento/EventoControladorAcessoController.destroy').middleware(['auth'])
// Route.put('eventoControladorAcessos', 'Evento/EventoControladorAcessoController.update').middleware(['auth', 'auditoria']) // ADM
// Route.get('showEventControladores', 'Evento/EventoControladorAcessoController.showEventControladores').middleware(['auth']) // ADM

// Route.get('eventoProdutores', 'Evento/EventoProdutoreController.index')
// Route.delete('eventoProdutores/:id', 'Evento/EventoProdutoreController.destroy').middleware(['auth'])
// Route.put('eventoProdutores', 'Evento/EventoProdutoreController.update').middleware(['auth', 'auditoria']) // ADM
// Route.get('showEventProdutores', 'Evento/EventoProdutoreController.showEventProdutores').middleware(['auth']) // ADM

// Route.get('lotes/:id', 'Lote/LoteController.show')
// Route.post('lotes', 'Lote/LoteController.store').middleware(['auth', 'auditoria'])
// Route.put('lotes/:id', 'Lote/LoteController.update').middleware(['auth', 'auditoria'])
// Route.delete('lotes/:id', 'Lote/LoteController.destroy').middleware(['auth', 'auditoria'])
// /* ADM - Deleta o lote e carrega a lista dos lotes ativos do evento passado como parametro para (indexEventLote) */
// Route.delete('deleteEventLotes/:id', 'Lote/LoteController.deleteEventLotes').middleware(['auth', 'auditoria'])
// /* ADM - Carrega a lista dos lotes ativos do evento passado pela função (deleteEventLotes) */
// Route.delete('indexEventLotes/:id', 'Lote/LoteController.indexEventLotes').middleware(['auth', 'auditoria'])
// /* ADM - Mostra todos os LOTES (ativo e inativo) a partir do nome do Evento - ADM */
// Route.get('lotes', 'Lote/LoteController.index')
// /* ADM - Mostra os lotes a partir do nome do EVENTO */
// Route.get('showEventLotes', 'Lote/LoteController.showLotesADM')
// // SITE - Mostra os lotes a partir do id do EVENTO - SITE
// Route.get('showLotes/:id', 'Lote/LoteController.showLotes')

// Route.post('ingressos', 'Ingresso/IngressoController.store').middleware(['auth', 'auditoria'])
// Route.put('ingressos/:id', 'Ingresso/IngressoController.update').middleware(['auth', 'auditoria'])
// Route.delete('ingressos/:id', 'Ingresso/IngressoController.destroy').middleware(['auth', 'auditoria'])
// Route.get('ingressos', 'Ingresso/IngressoController.index')
// Route.get('ingressos/:id', 'Ingresso/IngressoController.show')
// Route.get('showTickets', 'Ingresso/IngressoController.showTickets').middleware(['auth'])
// Route.get('myTickets', 'Ingresso/IngressoController.myTickets') // Meus Ingressos - SITE
// Route.get('showTicketsCPF', 'Ingresso/IngressoController.showTicketsCPF').middleware(['auth'])// ADM - Mostra ingressos de um cliente

// Route.get('showTransferTickets', 'Ingresso/IngressoHistTransferenciaController.showTransferTickets')
// Route.post('transferTickets', 'Ingresso/IngressoHistTransferenciaController.tranferTickets').middleware(['auth'])// SITE -  Transferencia de Ingressos

// Route.post('usersFornecedor', 'Usuarios/Fornecedor/FornecedorController.store').middleware(['auth', 'auditoria'])
// Route.put('usersFornecedor/:id', 'Usuarios/Fornecedor/FornecedorController.update').middleware(['auth', 'auditoria'])
// Route.put('inativeFornecedor/:id', 'Usuarios/Fornecedor/FornecedorController.destroy').middleware(['auth'])
// Route.get('filterUsersFornecedor', 'Usuarios/Fornecedor/FornecedorController.show')

// /* SITE - vendas: Faz a venda na parte do cliente */
// Route.post('vendas', 'Vendas/VendaController.store').middleware(['auth', 'auditoria'])
// Route.put('vendas/:id', 'Vendas/VendaController.update').middleware(['auth', 'auditoria'])
// Route.delete('vendas/:id', 'Vendas/VendaController.destroy').middleware(['auth', 'auditoria'])
// Route.get('vendas', 'Vendas/VendaController.index')
// Route.get('vendas/:id', 'Vendas/VendaController.show')
// Route.get('showSalesAdm', 'Vendas/VendaController.showSalesAdm').middleware(['auth']) // ADM

// /* ADM - vendaComissario: Faz a venda na parte do comissario */
// Route.post('salesComissary', 'Vendas/VendaComissarioController.store').middleware(['auth', 'auditoria'])
// Route.get('salesComissary', 'Vendas/VendaComissarioController.salesComissary').middleware(['auth'])// ADM

// Route.post('vendaItens', 'Vendas/VendaItemController.store').middleware(['auth', 'auditoria'])
// Route.put('vendaItens/:id', 'Vendas/VendaItemController.update').middleware(['auth', 'auditoria'])
// Route.delete('vendaItens/:id', 'Vendas/VendaItemController.destroy').middleware(['auth', 'auditoria'])
// Route.get('vendaItens', 'Vendas/VendaItemController.index')
// Route.get('vendaItens/:id', 'Vendas/VendaItemController.show')

// Route.resource('sessions', 'Session/SessionController').apiOnly()
// Route.get('usersInformation', 'Session/SessionController.routeController')

// Route.post('grupos', 'Grupo/GrupoController.store').middleware(['auth', 'auditoria'])
// Route.put('grupos/:id', 'Grupo/GrupoController.update').middleware(['auth', 'auditoria'])
// Route.delete('grupos/:id', 'Grupo/GrupoController.destroy').middleware(['auth', 'auditoria'])
// Route.get('grupos', 'Grupo/GrupoController.index')
// Route.get('grupos/:id', 'Grupo/GrupoController.show')

// Route.resource('generos', 'Genero/GeneroController').apiOnly()

// Route.post('categorias', 'Categoria/CategoriaController.store').middleware(['auth', 'auditoria'])
// Route.put('categorias/:id', 'Categoria/CategoriaController.update').middleware(['auth', 'auditoria'])
// Route.delete('categorias/:id', 'Categoria/CategoriaController.destroy').middleware(['auth', 'auditoria'])
// Route.get('categorias', 'Categoria/CategoriaController.index')
// Route.get('categorias/:id', 'Categoria/CategoriaController.show')

// Route.post('parametros', 'Parametro/ParametroController.store').middleware(['auth', 'auditoria'])
// Route.put('parametros/:id', 'Parametro/ParametroController.update').middleware(['auth', 'auditoria'])
// Route.delete('parametros/:id', 'Parametro/ParametroController.destroy').middleware(['auth', 'auditoria'])
// Route.get('parametros', 'Parametro/ParametroController.index')
// Route.get('parametros/:id', 'Parametro/ParametroController.show')

// Route.post('passwords', 'ForgotPassword/ForgotPasswordController.store')
// Route.put('passwords', 'ForgotPassword/ForgotPasswordController.update')
// Route.get('passwords', 'ForgotPassword/ForgotPasswordController.testePassword')

// Route.post('sendLink', 'SendBillet/SendBilletLinkController.store')

// Route.get('filtersAdm', 'Filters/FilterAdmController.filter')
// Route.get('filtersProdutor', 'Filters/FilterProdutorController.filter')
// Route.get('filtersGroup', 'Filters/FilterGroupController.filter')
// Route.get('filtersCategory', 'Filters/FilterCategoryController.filter')

// Route.post('usersLocatario', 'LocatarioController.store').middleware(['auth', 'auditoria']) // ADM
// Route.put('usersLocatario/:id', 'LocatarioController.update').middleware(['auth', 'auditoria']) // ADM
// Route.put('inativeLocatario/:id', 'LocatarioController.inative').middleware(['auth', 'auditoria']) // ADM
// Route.get('showAllLocatarios', 'LocatarioController.showAllLocatarios') // ADM
// Route.get('showLocatario', 'LocatarioController.showLocatario') // ADM
// Route.get('showPontoVenda', 'LocatarioController.showPontoVenda') // ADM
// Route.delete('usersDeleteLocatario/:id', 'LocatarioController.destroy').middleware(['auth']) // BACK
// Route.get('usersLocatario', 'LocatarioController.index') // BACK

// Route.post('products', 'ProdutosLocatarioController.store').middleware(['auth', 'auditoria']) // ADM
// Route.put('products/:id', 'ProdutosLocatarioController.update').middleware(['auth', 'auditoria']) // ADM
// Route.delete('products/:id', 'ProdutosLocatarioController.destroy').middleware(['auth', 'auditoria'])// ADM
// Route.get('showAllProducts', 'ProdutosLocatarioController.showAllProducts') // ADM
// Route.get('showProduct', 'ProdutosLocatarioController.showProduct') // ADM

// Route.get('generateQRCode', 'QrCode/QrCodeController.generateQRCode')

// /*  QrCodeController ***********************************************************************************

// */

// /* PAGSEGURO ********************************************************************************************/
// /**
//  * Routas do pagseguro
//  * 1º - gerar uma sessão
//  * corpo email, token do vendedor
//  */

// Route.post('pagseguro/generatedSession', 'modules/pagSeguro/IdSessionsController.store')
// Route.get(
//   'pagseguro/methodsPayment',
//   'modules/pagSeguro/MethodsPayments.index'
// )
// Route.get('pagseguro/brandCard', 'modules/pagSeguro/BrandCard.index')
// Route.post('pagseguro/tokenCard', 'modules/pagSeguro/TokenCard.store')
// Route.get(
//   'pagseguro/installments',
//   'modules/pagSeguro/InstallmentConditions.index'
// )
// Route.post(
//   'pagseguro/payment/billet',
//   'modules/pagSeguro/payment/Billet.store'
// )
// Route.post('pagseguro/payment/debit', 'modules/pagSeguro/payment/Debit.store')
// Route.post(
//   'pagseguro/payment/credit',
//   'modules/pagSeguro/payment/Credit.store'
// )
// Route.post(
//   'pagseguro/cancel',
//   'modules/pagSeguro/chargeback/CancelTransaction.store'
// )
// Route.post(
//   'pagseguro/chargeback',
//   'modules/pagSeguro/chargeback/ChargeBack.store'
// )
// Route.post(
//   'pagseguro/notification',
//   'modules/pagSeguro/notification/Notification.store'
// )

// /* TESTES ***********************************************************************************************/

// /*  SaveProductorComissaryController *********************************************************************/
// Route.post('testeArray', 'Testes/SaveProductorComissaryController.main')
// /*  SaveProductorComissaryController *********************************************************************/

// Route.post('testes', 'TestesController.buyTickets').middleware([
//   'auth',
//   'auditoria'
// ])

// // Mostra eventos que estão ativos e seus lotes.
// Route.get('eventsHome', 'Testes/TestesController.showEventsWithLotes')

// // Mostra os lotes ativos de um evento
// Route.get('mostraLotes', 'EventoController.mostraLotesAtivos')

// Route.get('teste/:id', 'IngressoController.testeMostraIngresso')
// Route.get('array', 'testeMostraDadoController.testeArray')
// Route.get('buyTickets', 'Testes/TestesController.buyTickets').middleware(['auth', 'auditoria'])
// Route.get('showUser/:id', 'Testes/TestesController.showUser')
// /* Teste de formato de data */
// Route.post('testFormatDate', 'Testes/TestesController.testFormatDate')
// Route.get('a', 'Testes/TestesController.a')

// /* TESTES ***********************************************************************************************/
