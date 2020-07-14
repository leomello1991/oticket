'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.table('ingressos', (table) => {
      table
      .integer('consumidor_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      .unsigned()
      table
      .integer('intermediario_id')
      .references('id')
      .inTable('users')
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
