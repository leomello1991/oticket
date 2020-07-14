
const { validate } = use('Validator')
const rules = use('App/Validators/rules/createSessionId')
const CreateSessionIdService = use('App/Services/vendas/pagSeguro/CreateSessionIdPagSeguroService')
class IdSessionsController {
  // um controller só pode ter cinco metodos se não deve criar outro controller
  // estes são store,
  async store ({ request, response }) {
    const validation = await validate(request.post(), rules)
    if (validation.fails()) {
      return response.status(400).send({
        error: true,
        message: 'missing required fields'
      })
    }
    const { _data: { email, token } } = validation
    const createSessionIdService = new CreateSessionIdService()
    const { error, info, sessionId } = await createSessionIdService.execute({ email, token })
    if (error instanceof Error) {
      return response.status(info.status).send({ message: info.message })
    }
    return response.status(200).send({ sessionId })
  }
}
module.exports = IdSessionsController
