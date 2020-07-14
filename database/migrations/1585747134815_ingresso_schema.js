'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table.string('cpf', 14).alter()
      table.timestamp('dataNascimento').alter()
      table.timestamp('data').alter()
      table.string('origem').alter() // imp,fis,online,site
      table.string('situacao').alter() // aberto,utilizado,cancelado
    })
  }

  down () {
    this.table('ingressos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = IngressoSchema
