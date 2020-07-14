'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressosSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table.renameColumn('consumidor_id', 'cliente_id')
    })
  }

  down () {
    this.table('ingressos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = IngressosSchema
