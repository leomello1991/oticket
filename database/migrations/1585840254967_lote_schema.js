'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoteSchema extends Schema {
  up () {
    this.table('lotes', (table) => {
      table.string('nome', 60).alter()
      table.decimal('valor', 15, 2).alter()
      table.integer('quantidade').alter()
      table.integer('nroIngressosCpf').alter()
      table.date('viradaLote').alter()
      table.string('status', 20).alter() // ativo,inativo
      table.string('tipoLote', 20).alter() // int,meia,prom,cort
    })
  }

  down () {
    this.table('lotes', (table) => {
      // reverse alternations
    })
  }
}

module.exports = LoteSchema
