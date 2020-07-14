'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedors', (table) => {
      table.string('cpfFavorecido', 14)
      table.string('cnpjFavorecido', 18)
    })
  }

  down () {
    this.table('fornecedors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
