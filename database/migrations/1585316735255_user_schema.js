'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
      .integer('fornecedor_id')
      .references('id')
      .inTable('fornecedors')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      .unsigned()
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
