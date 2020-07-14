const Env = use('Env')
const axios = require('axios')

// utiliza adb reverse tcp:3333 tcp:3333
//
const api = axios.create({
  baseURL: Env.get('NODE_ENV') === 'development' ? 'https://ws.sandbox.pagseguro.uol.com.br' : 'https://ws.pagseguro.uol.com.br'
})
module.exports = api
