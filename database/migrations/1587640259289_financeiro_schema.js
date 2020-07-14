'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FinanceiroSchema extends Schema {
  up () {
    this.create('financeiros', (table) => {
      table.increments()
      table.string('document') //documento
      table.integer('portion') //parcela
      table.string('type') // tipo - vendaIng,pagForn,sangria,cancVenda,cancIng
      table.date('dateEmission') //dataEmissao
      table.decimal('value') //valor
      table.string('paymentMethod') //meioPagamento - dinheiro,cartao,boleto
      table.date('dueDate') //dataVencimento
      table.date('paymentDate') //dataPagamento
      table.string('typeLaunch') //tipoLançamento - pagar,receber,sangria
      table.string('situation') //situacao - aberto,baixado,cancelado
      table.string('lowOrigin') //origemBaixa - normal, solicPagtoFornecedor
      table
      .integer('evento_id')
      .references('id')
      .inTable('eventos')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      table
      .integer('lote_id')
      .references('id')
      .inTable('lotes')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      table
      .integer('comissario_id')
      .references('id')
      .inTable('users')
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
      table
      .integer('fornecedor_id')
      .references('id')
      .inTable('fornecedors')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('financeiros')
  }
}

module.exports = FinanceiroSchema
