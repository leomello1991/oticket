'use strict'

const Fornecedor = use('App/Models/Fornecedor')

class FilterController {
  async filter ({ request, response, auth }) {
    const verifyToken = await auth.check() // Checando token

    if (!verifyToken) {
      return response.status(401).json('token invalido')
    }

    // Usuário Logado
    const userRegister = await auth.getUser()
    console.log('Permissão: ' + userRegister.permission)

    try {
      const { page, pageSize, name } = request.get()

      // PRODUTOR apenas faz buscas em FORNECEDORES.
      // Nesta pesquisa o campo permission sempre virá como Fornecedor..
      if ((userRegister.permission.toLowerCase() === 'produtor')) {
        // Se todas das opções forem setadas...
        if (name) {
          console.log('todos')
          const data = await Fornecedor
            .query()
            .where('name', name)
            .paginate(page, pageSize)
          return data
        }

        // Se nenhuma das opções forem setadas...
        if (name === '') {
          console.log('nenhum')
          const data = await Fornecedor
            .query()
            .orderBy('name')
            .paginate(page, pageSize)
          return data
        }
      }
    } catch (error) {
      return response.status(400).json('Permissão negada')
    }
  }
}

module.exports = FilterController
