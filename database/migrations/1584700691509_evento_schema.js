'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.table('eventos', (table) => {
      table.string('nome', 60).alter()
      table.timestamp('data').alter()
      table.timestamp('hora').alter()
      table.string('cidade', 50).alter()
    })
  }

  down () {
    this.table('eventos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoSchema
