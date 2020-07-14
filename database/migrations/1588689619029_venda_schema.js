'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaSchema extends Schema {
  up () {
    this.table('vendas', (table) => {
      table.decimal('valorTotal')
      table.integer('qtdeTotal')
    })
  }

  down () {
    this.table('vendas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = VendaSchema
