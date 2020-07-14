'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table
      .integer('venda_id')
      .references('id')
      .inTable('vendas')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      .unsigned()
     
      table
      .integer('evento_id')
      .references('id')
      .inTable('eventos')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      .unsigned()
    
    })
  }

  down () {
    this.table('ingressos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = IngressoSchema
