const Exceptions = require('../../../../../Exceptions/CustomException')
const rules = use('App/Validators/rules/notification')
const { validate } = use('Validator')

class Notification {
  async store ({ request, response }) {
    const validation = await validate(request.post(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const {
      _data
    } = validation
    try {
      return response.status(200).send(_data)
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      return response.send({
        error: true,
        message: message
      })
    }
  }
}

module.exports = Notification
