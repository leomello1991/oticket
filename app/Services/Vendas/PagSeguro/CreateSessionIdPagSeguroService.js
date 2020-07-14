// Dependency Inversion (SOLID)
'use strict'
const api = require('../../../../Services/apiPagSeguro')
const xmlJs = require('xml-js')
class CreateSessionIdPagSeguroService {
  async execute ({
    email,
    token
  }) {
    try {
      const { data } = await api.post(`/v2/sessions?email=${email}&token=${token}`)
      const {
        session: {
          id: {
            _text: sessionId
          }
        }
      } =
      xmlJs.xml2js(data, { compact: true, spaces: 4 })
      return { sessionId }
    } catch (error) {
      return { error: new Error('erro in call message'), info: { message: error.message, status: 401 } }
    }
  }
}

module.exports = CreateSessionIdPagSeguroService
