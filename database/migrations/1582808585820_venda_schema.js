'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaSchema extends Schema {
  up() {
    this.create('vendas', (table) => {
      table.increments()
      table.timestamp('data').notNullable()
      table.string('situacao', 60).notNullable() //ativo,cancelada
      table.string('meioPagamento', 60).notNullable() //dinheiro,cartao
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down() {
    this.drop('vendas')
  }
}

module.exports = VendaSchema
