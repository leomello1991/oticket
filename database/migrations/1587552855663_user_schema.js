'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('cardNumber')
      table.string('cardholder')
      table.date('monthValidity')
      table.date('yearValidity')
      table.string('street') 
      table.integer('number') 
      table.string('neighborhood') 
      table.string('locale')
      table.string('postalCode')
      table.string('complement')
      table.string('ufS')
    })
  }
    
  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
