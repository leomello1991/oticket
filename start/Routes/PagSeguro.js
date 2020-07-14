'use strict'

const Route = use('Route')

Route.post('pagSeguro', 'PagSeguro/PagSeguroController.store')

Route.get('pagSeguro', 'PagSeguro/PagSeguroController.index')

/**
 * Routas do pagseguro
 * 1º - gerar uma sessão
 * corpo email, token do vendedor
 */

Route.post('pagseguro/generatedSession', 'modules/pagSeguro/IdSessionsController.store')

Route.get('pagseguro/methodsPayment', 'modules/pagSeguro/MethodsPayments.index')

Route.get('pagseguro/brandCard', 'modules/pagSeguro/BrandCard.index')

Route.post('pagseguro/tokenCard', 'modules/pagSeguro/TokenCard.store')

Route.get('pagseguro/installments', 'modules/pagSeguro/InstallmentConditions.index')

Route.post('pagseguro/payment/billet', 'modules/pagSeguro/payment/Billet.store')

Route.post('pagseguro/payment/debit', 'modules/pagSeguro/payment/Debit.store')

Route.post('pagseguro/payment/credit', 'modules/pagSeguro/payment/Credit.store')

Route.post('pagseguro/cancel', 'modules/pagSeguro/chargeback/CancelTransaction.store')

Route.post('pagseguro/chargeback', 'modules/pagSeguro/chargeback/ChargeBack.store')

Route.post('pagseguro/notification', 'modules/pagSeguro/notification/Notification.store')
