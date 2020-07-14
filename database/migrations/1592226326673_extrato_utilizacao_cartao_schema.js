'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExtratoUtilizacaoCartaoSchema extends Schema {
  up () {
    this.create('extrato_utilizacao_cartaos', (table) => {
      table.increments()
      table.string('cardNumber')
      table.decimal('feeCharged', 10,2) /* taxaCobrada */
      table.string('paymentMethod') /* boleto, cartao de credito, cartao de debito */
      table.string('type') /* credito, debito */
      table.decimal('grossValue',10,2) /* valor bruto */
      table.decimal('netValue',10,2) /* valor liquido */
      table.date('moveDate') /* data da movimentação */
      table
        .integer('vendaProduto_id')
        .references('id')
        .inTable('venda_produtos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('locatario_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('cliente_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('pontoVenda_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('extrato_utilizacao_cartaos')
  }
}

module.exports = ExtratoUtilizacaoCartaoSchema
