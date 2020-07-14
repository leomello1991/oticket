'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCardSchema extends Schema {
  up () {
    this.create('user_cards', (table) => {
      table.increments()
      table.integer('cardNumber')
      table.string('cardholder')
      table.date('monthValidity')
      table.date('yearValidity')
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')      
      table.timestamps()
    })
  }

  down () {
    this.drop('user_cards')
  }
}

module.exports = UserCardSchema
