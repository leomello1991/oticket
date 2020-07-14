'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogSangriaSchema extends Schema {
  up () {
    this.table('log_sangrias', (table) => {
      table.dropColumn('administrador_id')
    })
  }

  down () {
    this.table('log_sangrias', (table) => {
      // reverse alternations
    })
  }
}

module.exports = LogSangriaSchema
