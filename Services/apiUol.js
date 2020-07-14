const axios = require('axios')

// utiliza adb reverse tcp:3333 tcp:3333
//
const api = axios.create({
  baseURL: 'https://df.uol.com.br/'
})
module.exports = api
