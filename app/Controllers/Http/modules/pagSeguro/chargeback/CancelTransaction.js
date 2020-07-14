const qs = require('qs')
const Exceptions = require('../../../../../Exceptions/CustomException')
const rules = use('App/Validators/rules/chargeback')
const api = require('../../../../../../Services/apiPagSeguro')
const { validate } = use('Validator')

class CancelTransaction {
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }

      const parsedBodyContentTypeUrlencodedWwwX = qs.stringify({
        transactionCode
      })

      const { data } = await api.post(
        `/v2/transactions/cancels?email=${email}&token=${token}`,
        parsedBodyContentTypeUrlencodedWwwX,
        headers)
      console.log('cancelamento')
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

module.exports = CancelTransaction
