'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.table('eventos', (table) => {
      table.dropColumn('imagemHome')
      table.dropColumn('imagemIngresso')
   
    })
  }

  down () {
    this.table('eventos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoSchema
