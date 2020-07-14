const Exceptions = require('../../../../../Exceptions/CustomException')
const qs = require('qs')
const rules = use('App/Validators/rules/chargeback')
const api = require('../../../../../../Services/apiPagSeguro')
const { validate } = use('Validator')

class ChargeBack {
  async store ({ request, response }) {
    const validation = await validate(request.post(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const {
      _data: {
        email,
        token,
        transactionCode
      }
    } = validation
    try {
      const headers = {
        'Content-Type': 'application/xml;charset=ISO-8859-1'
      }
      const parsedBodyContentTypeUrlencodedWwwX = qs.stringify({
        transactionCode
      })
      const { data } = await api.post(
        `/v2/transactions/refunds?email=${email}&token=${token}`,
        parsedBodyContentTypeUrlencodedWwwX,
        headers
      )
      console.log('estorno')
      console.log(data)
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

module.exports = ChargeBack
