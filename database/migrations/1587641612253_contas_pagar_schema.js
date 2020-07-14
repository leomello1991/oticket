'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContasPagarSchema extends Schema {
  up () {
    this.create('contas_pagars', (table) => {
      table.increments()
      table.date('dateEmission') // dataEmissao
      table.date('dueDate') // dataVencimento
      table.date('estimatedPayDate') // dataPrevisaoPgto)
      table.string('situation') // situacao - aberto,agendado,pago,cancelado
      table.decimal('value') // valor
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('evento_id')
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('fornecedor_id')
        .references('id')
        .inTable('fornecedors')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('despesa_id')
        .references('id')
        .inTable('despesas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('produtor_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('contas_pagars')
  }
}

module.exports = ContasPagarSchema
