'use strict'

const { Utils } = use('App/Helpers/Utils')
const PagSeguro = use('App/Models/PagSeguro')

class PagSeguroController {
  async store ({ request, response }) {
    const data = Utils.convertJasonLowercase(request.only([
      'emailSalesman',
      'passwordSalesman',
      'emailCustomer',
      'tokenCustomer'
    ]))
    await PagSeguro.create(data)
  }

  // -------------------------------------------------------------------------//

  async index () {
    const pagSeguro = await PagSeguro.query().fetch()
    return pagSeguro
  }
}

module.exports = PagSeguroController
