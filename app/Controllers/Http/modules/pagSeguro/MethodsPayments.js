
const Exceptions = require('../../../../Exceptions/CustomException')
const api = require('../../../../../Services/apiPagSeguro')
const { validate } = use('Validator')
class MethodsPayments {
  // um controller só pode ter cinco metodos se não deve criar outro controller
  // estes são store,
  async index ({ request, response }) {
    const rules = {
      sessionId: 'required',
      value: 'required'
    }
    const validation = await validate(request.get(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const { _data: { value } } = validation
    const { sessionId } = request.get()
    try {
      const { data: { paymentMethods } } = await api.get(`/payment-methods/?value=${value}&sessionId=${sessionId}`, {
        headers: {
          Accept: 'application/vnd.pagseguro.com.br.v1+json;charset=ISO-8859-1'
        }
      })
      return response.status(200).send(paymentMethods)
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
