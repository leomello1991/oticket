'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoteSchema extends Schema {
  up () {
    this.table('lotes', (table) => {
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      
     
    })
  }

  down () {
    this.table('lotes', (table) => {
      // reverse alternations
    })
  }
}

module.exports = LoteSchema
