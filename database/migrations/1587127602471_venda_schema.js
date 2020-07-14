'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaSchema extends Schema {
  up () {
    this.table('vendas', (table) => {
      table.renameColumn('intermediario_id', 'comissario_id')
    })
  }

  down () {
    this.table('vendas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = VendaSchema
