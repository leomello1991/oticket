'use strict'

class Auditoria {
  async handle ({ request, auth }, next) {
    const usuarioLogado = await auth.getUser()
    request.user_id = usuarioLogado.id
    await next()
  }
}

module.exports = Auditoria
