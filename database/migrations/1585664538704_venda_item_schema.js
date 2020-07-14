'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaItemSchema extends Schema {
  up () {
    this.table('venda_itens', (table) => {
      table.integer('quantidade').alter()
      table.decimal('valor').alter()
    })
  }

  down () {
    this.table('venda_itens', (table) => {
      // reverse alternations
    })
  }
}

module.exports = VendaItemSchema
