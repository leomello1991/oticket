'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCardSchema extends Schema {
  up () {
    this.table('user_cards', (table) => {
      table.string('cardNumber').alter()
     
      
    })
  }

  down () {
    this.table('user_cards', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserCardSchema
