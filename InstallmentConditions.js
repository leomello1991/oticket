const axios = require('axios')
const Exceptions = require('../../../../Exceptions/CustomException')
const api = require('../../../../../Services/apiPagSeguro')
const xmlJs = require('xml-js')
const { validate } = use('Validator')
class MethodsPayments {
  // um controller só pode ter cinco metodos se não deve criar outro controller
  // estes são store,
  async index ({ request, response }) {
    const rules = {
      sessionId: 'required',
      value: 'required',
      flagCard: 'required'
    }
    const validation = await validate(request.get(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const { _data: { value, flagCard } } = validation
    const { sessionId } = request.get()
    try {
      const { data } = await api.get('https://sandbox.pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=72459b5577ec481caaa2cd44fff08b66&amount=300.00&creditCardBrand=visa&maxInstallmentNoInterest=3')
      return response.status(200).send(data)
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.send({
        error: true,
        message: message
      })
    }
  }
}
module.exports = MethodsPayments
