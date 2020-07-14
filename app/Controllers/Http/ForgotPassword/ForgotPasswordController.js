'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const Hash = use('Hash')

class ForgotPasswordController {
  async store ({ request, response }) {
    const email = request.input('email')
    const newLink = request.input('newLink')

    try {
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(['emails.forgot_password', 'emails.forgot_password_txt'],
        {
          email,
          name: user.name,
          token: user.token,
          link: `${newLink}?token=${user.token}`
        },

        message => {
          message
            .to(user.email)
            .from('edigleison@edigleison', 'Incca | Incca Sistemas')
            .subject('Recuperação de senha')
        }

      )
      const enviaToken = {
        token: user.token
      }
      const json = JSON.stringify(enviaToken)
      return json
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      // Buscando token e password enviados pela requisição
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      if (user === null) {
        return response
          .status(400)
          .send({ error: { message: 'Token inválido' } })
      }

      const tokenExpired = moment().subtract('5', 'minutes').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'O token de recuperação está expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      console.log('novo password:' + password)

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar sua senha' } })
    }
  }

  async testePassword ({ request, response }) {
    // recebendo password do front-end
    const { password } = request.all()
    console.log('veio do front: ' + password)

    // criptografando password para procurar
    const teste = await Hash.make(password) // teste
    console.log('Criptografando: ' + teste)

    const verifyPass = User.findByOrFail('password', teste)
    console.log('Verificação: ' + verifyPass)

    return verifyPass
  }
}

module.exports = ForgotPasswordController
