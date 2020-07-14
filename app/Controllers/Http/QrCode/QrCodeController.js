'use strict'

const QRCode = require('qrcode')
const Encryption = use('Encryption')

class QrCodeController {
  async generateQRCode ({ request, response }) {
    const { token } = request.all()

    // Descriptando o token
    const tokenQRCode = Encryption.decrypt(token)

    // Gerando o qrCode através do token descriptado
    const qrCode = QRCode.toString(tokenQRCode, { type: 'png' }, function (qrCode) { return qrCode })
    return response.send(qrCode)
  }
}

module.exports = QrCodeController
