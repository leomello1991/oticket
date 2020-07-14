'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.table('eventos', (table) => {
      table.dropColumn('produtor_id')
      table.renameColumn('user_log', 'user_id')
    })
  }

  down () {
    this.table('eventos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoSchema
