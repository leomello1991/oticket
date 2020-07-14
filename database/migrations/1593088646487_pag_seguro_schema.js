'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagSeguroSchema extends Schema {
  up () {
    this.create('pag_seguros', (table) => {
      /* customer, salesman */
      table.increments()
      table.string('emailSalesman')
      table.string('passwordSalesman')
      table.string('emailCustomer')
      table.string('tokenCustomer')
      table.timestamps()
    })
  }

  down () {
    this.drop('pag_seguros')
  }
}

module.exports = PagSeguroSchema
