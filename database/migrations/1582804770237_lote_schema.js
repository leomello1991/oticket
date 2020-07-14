'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoteSchema extends Schema {
  up () {
    this.create('lotes', (table) => {
      table.increments()
      table.string('nome', 60).notNullable()
      table.decimal('valor', 15, 2).notNullable()
      table.integer('quantidade').notNullable()
      table.integer('nroIngressosCpf').notNullable()
      table.timestamp('viradaLote').notNullable()
      table.string('status', 20).notNullable() // ativo,inativo
      table.string('tipoLote', 20).notNullable() // int,meia,prom,cort
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
        .unique()
      table
        .integer('grupo_id')
        .references('id')
        .inTable('grupos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('lotes')
  }
}

module.exports = LoteSchema
