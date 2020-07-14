'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EventoProdutore extends Model {
  lote () {
    return this.belongsTo('App/Models/Lote')
  }
  

  
}

module.exports = EventoProdutore
