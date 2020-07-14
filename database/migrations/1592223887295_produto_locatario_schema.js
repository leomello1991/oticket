'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProdutoLocatarioSchema extends Schema {
  up () {
    this.create('produto_locatarios', (table) => {
      table.increments()
      table.string('productCode', 14).unique()
      table.string('description')
      table.integer('unit')
      table.decimal('value', 10, 2)
      table
        .integer('locatario_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('produto_locatarios')
  }
}

module.exports = ProdutoLocatarioSchema
