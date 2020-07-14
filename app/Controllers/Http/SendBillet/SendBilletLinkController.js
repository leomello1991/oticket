'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')

class SendBilletLinkController {
  async store ({ request, response }) {
    const email = request.input('email')
    const newLink = request.input('newLink')

    try {
      const user = await User.findByOrFail('email', email)

      await Mail.send(['emails.send_billet_link'],
        {
          email,
          name: user.name,
          link: `${newLink}`
        },

        message => {
          message
            .to(user.email)
            .from('Oticket.com', 'Oticket')
            .subject('Link para emissão de boleto')
        }
      )
      return response.status(200).send({ message: 'Email enviado com sucesso!' })
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: 'Algo deu errado!' })
    }
  }
}

module.exports = SendBilletLinkController
