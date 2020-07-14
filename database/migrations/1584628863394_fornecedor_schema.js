'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedors', (table) => {
      table.integer('user_log')
    })
  }

  down () {
    this.table('fornecedors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
