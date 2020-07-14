'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table.string('email')
    })
  }

  down () {
    this.table('ingressos', (table) => {
      table.dropColumn('email')
    })
  }
}

module.exports = IngressoSchema
