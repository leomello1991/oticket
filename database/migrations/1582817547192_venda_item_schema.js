'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaItemSchema extends Schema {
  up() {
    this.create('venda_itens', (table) => {
      table.increments()
      table.integer('quantidade').notNullable()
      table.decimal('valor').notNullable()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table
        .integer('venda_id')
        .references('id')
        .inTable('vendas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table
        .integer('lote_id')
        .references('id')
        .inTable('lotes')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down() {
    this.drop('venda_itens')
  }
}

module.exports = VendaItemSchema
