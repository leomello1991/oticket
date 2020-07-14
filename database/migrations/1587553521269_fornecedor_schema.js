'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedors', (table) => {
      table.string('street') 
      table.integer('number') 
      table.string('neighborhood') 
      table.string('locale')
      table.string('postalCode')
      table.string('complement')
      table.string('ufS')
      table.string('cpfFavorecido', 14).unique()
      table.string('cnpjFavorecido', 18).unique()
    })
  }

  down () {
    this.table('fornecedors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
