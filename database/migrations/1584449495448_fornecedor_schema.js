'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.table('fornecedores', (table) => {
      table.renameColumn('nome', 'name')
      table.renameColumn('celular', 'celPhone')
    })
  }

  down () {
    this.table('fornecedores', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FornecedorSchema
