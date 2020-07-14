'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedores', (table) => {
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
    })
  }

  down () {
    this.table('fornecedores', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
