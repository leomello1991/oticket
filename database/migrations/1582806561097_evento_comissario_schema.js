'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoComissarioSchema extends Schema {
  up() {
    this.create('evento_comissarios', (table) => {
      table.increments()
      table.string('status', 20).notNullable() //ativo,inativo
      table.timestamp('data').notNullable()
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
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
        .integer('grupo_id')
        .references('id')
        .inTable('grupos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down() {
    this.drop('evento_comissarios')
  }
}

module.exports = EventoComissarioSchema
