'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      // table.string('username', 80).notNullable().unique() - removido
      table.string('password', 60).notNullable()
      table.string('nome', 60).notNullable()
      table.string('celular', 14)
      table.string('permissao', 60).notNullable() // adm,prod,com,cons,forn,contAcess
      table.string('cpf', 14).notNullable().unique()
      table.string('rg', 14).notNullable()
      table.string('status', 60).notNullable() // ativo,inativo
      table.string('sobrenome', 60)
      table.timestamp('dataNascimento').notNullable()
      table.string('telefone', 14)
      table.timestamp('dataCadastro').notNullable()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .unsigned()
      // table
      //   .integer('genero_id')
      //   .references('id')
      //   .inTable('generos')
      //   .onUpdate('CASCADE')
      //   .onDelete('SET NULL')
      //   .unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
