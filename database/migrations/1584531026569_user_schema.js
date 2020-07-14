'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('email', 254).alter()
      table.string('password', 60).alter()
      table.string('name', 60).alter()
      table.string('permission', 60).alter()
      table.string('cpf', 14).alter()
      table.string('rg', 14).alter()
      table.string('status', 60).alter()
      table.timestamp('dataNascimento').alter()
      table.timestamp('dataCadastro').alter()
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
