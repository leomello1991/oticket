'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoControladorAcessoSchema extends Schema {
  up () {
    this.table('evento_controlador_acessos', (table) => {
      table
      .integer('controladorAcesso_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
    })
  }

  down () {
    this.table('evento_controlador_acessos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EventoControladorAcessoSchema
