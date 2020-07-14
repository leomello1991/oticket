'use strict'

const Model = use('Model')

class Lote extends Model {
  evento () {
    return this.belongsTo('App/Models/Evento').select('id', 'nome')
  }

  grupo () {
    return this.belongsTo('App/Models/Grupo').select('id', 'descricao')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Lote
