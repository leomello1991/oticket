'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoteSchema extends Schema {
  up() {
    this.table('lotes', (table) => {
      table
        .integer('user_log')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
    })
  }

  down() {
    this.table('lotes', (table) => {
      // reverse alternations
    })
  }
}

module.exports = LoteSchema
