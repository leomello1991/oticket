'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaItemSchema extends Schema {
  up () {
    this.table('venda_items', (table) => {
      table.decimal('valorTotal')
    })
  }

  down () {
    this.table('venda_items', (table) => {
      // reverse alternations
    })
  }
}

module.exports = VendaItemSchema
