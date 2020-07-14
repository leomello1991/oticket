const Exceptions = require('../../../../Exceptions/CustomException')
const api = require('../../../../../Services/apiUol')
const qs = require('qs')
const { validate } = use('Validator')

class TokenCard {
  async store ({ request, response }) {
    const rules = {
      sessionId: 'required',
      amount: 'required',
      cardNumber: 'required|min:16|max:16',
      cardBrand: 'required',
      cardCvv: 'required|min:3|max:3',
      cardExpirationMonth: 'required|min:2|max:2',
      cardExpirationYear: 'required|min:4|max:4'
    }
    const validation = await validate(request.post(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const {
      _data: {
        sessionId,
        amount,
        cardNumber,
        cardBrand,
        cardCvv,
        cardExpirationMonth,
        cardExpirationYear
      }
    } = validation
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      const parsedBodyContentTypeUrlencodedWwwX = qs.stringify({
        sessionId,
        amount,
        cardNumber,
        cardBrand,
        cardCvv,
        cardExpirationMonth,
        cardExpirationYear
      })
      const { data: tokenCard } = await api.post('/v2/cards',
        parsedBodyContentTypeUrlencodedWwwX, headers)
      return response.status(200).send(tokenCard)
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.send({
        error: true,
        message: message
      })
    }
  }
}

module.exports = TokenCard
