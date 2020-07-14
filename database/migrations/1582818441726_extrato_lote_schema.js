'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExtratoLoteSchema extends Schema {
  up () {
    this.create('extrato_lotes', (table) => {
      table.increments()
      table.timestamp('data').notNullable()
      table.string('tipo', 20).notNullable() // entrada,saida
      table.string('observacao', 250) // entrada,saida
      table
        .integer('lote_id')
        .references('id')
        .inTable('lotes')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
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

  down () {
    this.drop('extrato_lotes')
  }
}

module.exports = ExtratoLoteSchema
