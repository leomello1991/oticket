'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ParametroSchema extends Schema {
  up () {
    this.create('parametros', (table) => {
      table.decimal('taxaTransferencia', 10, 2)
      table.timestamps()
    })
  }

  down () {
    this.drop('parametros')
  }
}

module.exports = ParametroSchema
