'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IngressoHistTransferencia extends Model {
  static get hidden () {
    return ['qrCode', 'created_at', 'updated_at', 'user_id', 'ingresso_id']
  }
}

module.exports = IngressoHistTransferencia
