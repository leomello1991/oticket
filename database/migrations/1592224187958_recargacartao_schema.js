'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecargacartaoSchema extends Schema {
  up () {
    this.create('recargacartaos', (table) => {
      table.increments()
      table.date('dateRecharge')
      table.string('cardNumber')
      table.decimal('feeCharged', 10, 2) /* taxaCobrada */
      table.string('paymentMethod') /* boleto, cartao de credito, cartao de debito */
      table.decimal('grossValue', 10, 2) /* valor bruto */
      table.decimal('netValue', 10, 2) /* valor liquido */
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
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('recargacartaos')
  }
}

module.exports = RecargacartaoSchema
