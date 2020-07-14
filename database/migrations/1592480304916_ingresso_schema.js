'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table.string('qrCode', 500).alter()
      table.boolean('status')
    })
  }

  down () {
    this.table('ingressos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = IngressoSchema
