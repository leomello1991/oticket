
function NewException (name, message) {
  this.name = name
  this.message = message
}
function errorVerify (error) {
  if (error instanceof TypeError) {
    return `erro de typagem de código linha:${error.line}, coluna:${error.column}`
  }
  if (error instanceof RangeError) {
    return `erro no tipo de variavel de código linha:${error.line}, coluna:${error.column}`
  }
  if (error.message === 'Request failed with status code 404') {
    return 'Erro na API verifique a chamada'
  }
  if (error.message === 'Network Error') {
    return 'Erro de conexao verifique sua Internet'
  }
  if (error.message === 'E_INVALID_JWT_TOKEN: jwt must be provided') {
    return 'Para realizar esta operação é necessário token.'
  }

  if (error.message === 'E_INVALID_JWT_TOKEN: invalid signature') {
    return 'Usuário não autorizado!'
  }

  return error.message
}

module.exports = {
  NewException,
  errorVerify
}
