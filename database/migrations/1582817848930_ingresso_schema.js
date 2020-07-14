'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngressoSchema extends Schema {
  up () {
    this.create('ingressos', (table) => {
      table.increments()
      table.string('qrCode')
      table.string('cpf', 14).notNullable()
      table.timestamp('dataNascimento').notNullable()
      table.timestamp('data').notNullable()
      table.string('origem').notNullable() // imp,fis,online,site
      table.string('situacao').notNullable() // aberto,utilizado,cancelado
      table.decimal('valor')
      table
        .integer('venda_id')
        .references('id')
        .inTable('vendas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
        .unique()
      table
        .integer('venda_item_id')
        .references('id')
        .inTable('venda_itens')
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
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
        .unique()
      table
        .integer('lote_id')
        .references('id')
        .inTable('lotes')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('ingressos')
  }
}

module.exports = IngressoSchema
