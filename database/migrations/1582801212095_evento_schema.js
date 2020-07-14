'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.create('eventos', (table) => {
      table.increments()
      table.string('nome', 60).notNullable()
      table.timestamp('data').notNullable()
      table.string('local', 60)
      table.timestamp('hora').notNullable()
      table.string('cidade', 50).notNullable()
      table.string('imagemHome', 60)
      table.string('imagemIngresso', 60)
      table.string('vendaIngresso', 60) // ativo,desabilitado
      table.string('status', 60) // ativo,inativo,cancelado
      table.decimal('taxaVendaCartao', 6, 2)
      table.decimal('taxaAcrescimoCompraSite', 6, 2)
      table.decimal('custoPrevisto', 15, 2)
      table.decimal('receitaPrevista', 15, 2)
      table.string('banners', 60)
      table.string('linkFanpage', 60)
      table.string('dadosInformativos', 250)
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
    this.drop('eventos')
  }
}

module.exports = EventoSchema
