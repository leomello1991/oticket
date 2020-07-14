'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoHistTransferenciaSchema extends Schema {
  up () {
    this.create('ingresso_hist_transferencias', (table) => {
      table.increments()
      table.string('qrCode')
      table.string('cpf').notNullable()
      table
        .integer('ingresso_id')
        .references('id')
        .inTable('ingressos')
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

  down () {
    this.drop('ingresso_hist_transferencias')
  }
}

module.exports = IngressoHistTransferenciaSchema
