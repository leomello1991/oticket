'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GrupoSchema extends Schema {
  up () {
    this.create('grupos', (table) => {
      table.increments()
      table.string('descricao', 80).unique()
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
    this.drop('grupos')
  }
}

module.exports = GrupoSchema
