'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedors', (table) => {
      table.string('name', 60).unique().alter()
      table.string('email', 60).unique().alter()
      table.string('cpf', 14).unique().alter()
    })
  }

  down () {
    this.table('fornecedors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
