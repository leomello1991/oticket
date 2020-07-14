'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('ie', 18)
      table.decimal('taxcard', 10, 2)
      table.string('ra')
      table.string('cardNumber')
      table.string('cardStatus') /* Bloqueado, ativo, cancelado */
      table
        .integer('locatario_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
