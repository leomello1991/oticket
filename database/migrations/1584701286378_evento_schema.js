'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.table('eventos', (table) => {
      table
        .integer('produtor_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
    })
  }

  down () {
    this.table('eventos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoSchema
