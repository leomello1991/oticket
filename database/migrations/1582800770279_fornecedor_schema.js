'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FornecedorSchema extends Schema {
  up () {
    this.create('fornecedores', (table) => {
      table.increments()
      table.string('nome', 60).notNullable().unique()
      table.string('email', 60).notNullable().unique()
      table.string('celular', 14)
      table.string('cpf', 14).notNullable().unique()
      table.string('rg', 14)
      table.string('cnpj', 18)
      table.string('ie', 18)
      table.string('banco', 5)
      table.string('agencia', 5)
      table.string('conta', 10)
      table.string('cidade', 50)
      table
        .integer('categoria_id')
        .references('id')
        .inTable('categorias')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('fornecedores')
  }
}

module.exports = FornecedorSchema
