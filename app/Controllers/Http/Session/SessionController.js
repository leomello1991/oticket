'use strict'

const User = use('App/Models/User')

class SessionController {
  // Validação de login.
  async store ({ request, response, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    const userRegister = await User.findBy('email', email)

    const data = {
      id: userRegister.id,
      name: userRegister.name,
      permission: userRegister.permission,
      token
    }

    const json = JSON.stringify(data)
    return json
  }

  // -------------------------------------------------------------------------//

  /*
  -> Route: login
  -> Validação: Esta rota será acessada apenas pelo comissário e sub comissário
  */
  async login ({ request, response, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    const userRegister = await User.findBy('email', email)
    console.log(userRegister.permission)

    if ((userRegister.permission !== 'sub comissario') && (userRegister.permission !== 'comissario')) {
      return response.status(401).send({ message: 'Pemissão negada!' })
    }

    const data = {
      id: userRegister.id,
      name: userRegister.name,
      permission: userRegister.permission,
      token
    }

    const json = JSON.stringify(data)
    return json
  }

  // -------------------------------------------------------------------------//

  // Retorna name e email do usuário logado
  async routeController ({ response, request, auth }) {
    const { token } = request.all()
    const verifyToken = await auth.check(token) // Checando token
    console.log(token)

    if (!verifyToken) {
      return response
        .status(401)
        .json('token invalido')
    }

    // Retorna detalhes do usuário logado
    const userRegister = await auth.getUser()
    
    console.log(userRegister.name)

    const teste = {
      id: userRegister.id,
      name: userRegister.name,
      email: userRegister.email,
      permission: userRegister.permission
    }
    const json = JSON.stringify(teste)
    return json
  }
}

module.exports = SessionController
