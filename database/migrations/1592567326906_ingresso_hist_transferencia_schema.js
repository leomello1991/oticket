'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoHistTransferenciaSchema extends Schema {
  up () {
    this.table('ingresso_hist_transferencias', (table) => {
      table.string('qrCode', 500).alter()
    })
  }

  down () {
    this.table('ingresso_hist_transferencias', (table) => {
      // reverse alternations
    })
  }
}

module.exports = IngressoHistTransferenciaSchema
