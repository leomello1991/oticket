'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogSangria extends Model {
  event () {
    return this.belongsTo('App/Models/Evento')
  }
}

module.exports = LogSangria
