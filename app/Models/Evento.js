'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Evento extends Model {
  /* FK de EVENTO dentro de LOTE - Mostra todos os lotes do evento - EventoController/filterEvent  */
  lotes () {
    return this.hasMany('App/Models/Lote')
  }

  produtores () {
    return this.hasMany('App/Models/EventoProdutore')
  }

  comissarios () {
    return this.hasMany('App/Models/EventoComissario')
  }
}

module.exports = Evento
