'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoControladorAcessoSchema extends Schema {
  up() {
    this.create('evento_controlador_acessos', (table) => {
      table.increments()
      table.string('status', 20).notNullable() //ativo,inativo
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
      table.timestamps()
    })
  }

  down() {
    this.drop('evento_controlador_acessos')
  }
}

module.exports = EventoControladorAcessoSchema
