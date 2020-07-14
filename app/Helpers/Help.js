'use strict'

const QRCode = require('qrcode')
const Encryption = use('Encryption')

/* Carrega o QRCode do ingresso */
async function generateQRCode (response, idLote) {
  // Descriptando o token
  const tokenQRCode = Encryption.decrypt(tokenQRCode)

  // Gerando o qrCode através do token descriptado
  const qrCode = QRCode.toString(tokenQRCode, { type: 'png' }, function (err, qrCode) {
    return qrCode
  })
  return response.send(qrCode)
}

module.exports = {
  generateQRCode
}
