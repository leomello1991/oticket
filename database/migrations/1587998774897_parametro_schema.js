'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ParametroSchema extends Schema {
  up () {
    this.table('parametros', (table) => {
      table.integer('id').defaultTo(1)
    })
  }

  down () {
    this.table('parametros', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ParametroSchema
