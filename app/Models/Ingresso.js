'use strict'

const Model = use('Model')

class Ingresso extends Model {
  venda () {
    return this.hasMany('App/Models/Venda')
  }

  lote () {
    return this.belongsTo('App/Models/Lote')
  }

  venda_item () {
    return this.belongsTo('App/Models/VendaItem')
  }

  vendas () {
    return this.belongsTo('App/Models/Venda')
  }

  evento () {
    return this.belongsTo('App/Models/Evento')
  }

  iht () {
    return this.hasMany('App/Models/IngressoHistTransferencia')
  }

  cliente () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Ingresso
