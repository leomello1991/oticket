'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GeneroSchema extends Schema {
  up () {
    this.create('generos', (table) => {
      table.increments()
      table.string('descricao', 80).unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('generos')
  }
}

module.exports = GeneroSchema
