const Exceptions = require('../../../../Exceptions/CustomException')
const api = require('../../../../../Services/apiUol')
const { validate } = use('Validator')
class BrandCard {
  // um controller só pode ter cinco metodos se não deve criar outro controller
  // estes são store,
  async index ({ request, response }) {
    const rules = {
      sessionId: 'required',
      creditCard: 'required|max:6|min:6'
    }
    const validation = await validate(request.get(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const { _data: { creditCard } } = validation
    const { sessionId } = request.get()
    //  https://df.uol.com.br/df-fe/mvc/creditcard/v1/getBin?tk={{ADICIONE O ID DE SESSÃO}}&creditCard={{ADICIONE O BIN DO CARTÃO}}
    try {
      const { data } = await api.get(`/df-fe/mvc/creditcard/v1/getBin?tk=${sessionId}&creditCard=${creditCard}`)
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
module.exports = BrandCard
