'use strict'
const AppError = use('App/Errors/AppErrors')
class Error {
  async handle ({ req, response }, next) {
    await next()
    if (response instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: err.message
      })
    }
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}

module.exports = Error
