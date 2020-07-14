'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoProdutoreSchema extends Schema {
  up () {
    this.table('evento_produtores', (table) => {
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
    this.table('evento_produtores', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoProdutoreSchema
