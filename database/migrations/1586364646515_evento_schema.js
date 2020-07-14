'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.table('eventos', (table) => {
      table.string('imagemHome', 250).alter()
      table.string('imagemIngresso', 250).alter()
    })
  }

  down () {
    this.table('eventos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoSchema
