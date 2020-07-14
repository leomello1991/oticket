'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaProdutosItemSchema extends Schema {
  up () {
    this.create('venda_produtos_items', (table) => {
      table.increments()
      table.integer('amount') /* quantidade */
      table.decimal('value')
      table
        .integer('vendaProduto_id')
        .references('id')
        .inTable('venda_produtos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('produtoLocatario_id')
        .references('id')
        .inTable('produto_locatarios')
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
    this.drop('venda_produtos_items')
  }
}

module.exports = VendaProdutosItemSchema
