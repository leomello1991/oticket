'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaProdutoSchema extends Schema {
  up () {
    this.create('venda_produtos', (table) => {
      table.increments()
      table.date('date')
      table.string('situation')
      table.string('paymentMethod') /* dinheiro, cartao de credito, cartao de debito, cartao oticket */
      table.string('cardNumber')
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
    this.drop('venda_produtos')
  }
}

module.exports = VendaProdutoSchema
