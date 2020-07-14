'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuarioMensagemSchema extends Schema {
  up () {
    this.create('usuario_mensagens', (table) => {
      table.increments()
      table.string('tipo', 60).notNullable() // recebida,enviada
      table.timestamp('data').notNullable()
      table.string('mensagem', 250)
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

  down () {
    this.drop('usuario_mensagens')
  }
}

module.exports = UsuarioMensagemSchema
