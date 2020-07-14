'use strict'

const Route = use('Route')

Route.get('recebimentos', 'ControleRecebimento/ControleRecebimentoController.ControleRecebimento')

Route.get('totalVendaRecebimentos', 'ControleRecebimento/ControleRecebimentoController.totalVendaRecebimentos')
