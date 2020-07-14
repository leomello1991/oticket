'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoComissarioSchema extends Schema {
  up () {
    this.table('evento_comissarios', (table) => {
      table.string('status', 20).alter()
      table.date('data').alter()
    })
  }

  down () {
    this.table('evento_comissarios', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoComissarioSchema
