'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoteSchema extends Schema {
  up () {
    this.table('lotes', (table) => {
      table.renameColumn('user_log', 'user_id')
    })
  }

  down () {
    this.table('lotes', (table) => {
      // reverse alternations
    })
  }
}

module.exports = LoteSchema
