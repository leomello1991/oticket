'use strict'

const User = use('App/Models/User')
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
      const { page, pageSize, name, permission, status, client } = request.get()

      // ADMINISTRADOR pode fazer busca em TODOS USUÁRIOS
      if (userRegister.permission.toLowerCase() === 'administrador') {
        console.log('entrou')

        /** Retorna a busca SEM clientes */
        if (client === 'não') {
          console.log('Sem Cliente')
          // Permissão Fornecedor
          if ((permission === 'fornecedor') && (name === '') && (status === '')) {
            console.log('apenas fornecedor')
            const data = await Fornecedor
              .query()
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }
          console.log('passou')

          if ((permission === 'fornecedor') && (name) && (status === '')) {
            console.log('fornecedor, name')
            const data = await Fornecedor
              .query()
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission === 'fornecedor') && (status) && (name === '')) {
            console.log('fornecedor, status')
            const data = await Fornecedor
              .query()
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission === 'fornecedor') && (status) && (name)) {
            console.log('fornacedor, status, nome')
            const data = await Fornecedor
              .query()
              .where('name', 'like', name + '%')
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission) && (name) && (status)) {
            console.log('permission, name, status')
            const data = await User
              .query()
              .where('name', 'like', name + '%')
              .where('permission', permission)
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // Se nenhuma das opções forem setadas...ORDEM ALFABÉTICA
          if ((permission === '') && (name === '') && (status === '')) {
            console.log('todos vazios')
            const data = [
              await User.query().orderBy('name').whereNot('permission', 'cliente').paginate(page, pageSize),
              await Fornecedor.query().orderBy('name').paginate(page, pageSize)
            ]
            return data
          }

          // permission e status
          if ((permission) && (status)) {
            console.log('permission,staus')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // permission e name
          if ((permission) && (name)) {
            console.log('permission, name')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // status e name
          if ((status) && (name)) {
            console.log('status, name')// teste
            const data = await User
              .query()
              .where('status', status)
              .whereNot('permission', 'cliente')
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // apenas permission
          if (permission) {
            console.log('permission')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // apenas name
          if (name) {
            console.log('name')// teste
            const data = [
              await User.query().where('name', 'like', name + '%').orderBy('name').whereNot('permission', 'cliente').paginate(page, pageSize),
              await Fornecedor.query().where('name', 'like', name + '%').orderBy('name').paginate(page, pageSize)
            ]
            return data
          }

          // apenas status
          if (status) {
            console.log('status')// teste
            const data = [
              await User.query().where('status', status).whereNot('permission', 'cliente').orderBy('name').paginate(page, pageSize),
              await Fornecedor.query().where('status', status).orderBy('name').paginate(page, pageSize)
            ]
            return data
          }
        }

        /** Retorna a busca COM clientes */
        if (client === 'sim') {
          console.log('Com Cliente')
          // Permissão Fornecedor
          if ((permission === 'fornecedor') && (name === '') && (status === '')) {
            console.log('apenas fornecedor')
            const data = await Fornecedor
              .query()
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission === 'fornecedor') && (name) && (status === '')) {
            console.log('fornecedor, name')
            const data = await Fornecedor
              .query()
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission === 'fornecedor') && (status) && (name === '')) {
            console.log('fornecedor, status')
            const data = await Fornecedor
              .query()
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission === 'fornecedor') && (status) && (name)) {
            console.log('fornacedor, status, nome')
            const data = await Fornecedor
              .query()
              .where('name', 'like', name + '%')
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          if ((permission) && (name) && (status)) {
            console.log('permission, name, status')
            const data = await User
              .query()
              .where('name', 'like', name + '%')
              .where('permission', permission)
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // Se nenhuma das opções forem setadas...ORDEM ALFABÉTICA
          if ((permission === '') && (name === '') && (status === '')) {
            console.log('todos vazios')
            const data = [
              await User.query().orderBy('name').paginate(page, pageSize),
              await Fornecedor.query().orderBy('name').paginate(page, pageSize)
            ]
            return data
          }

          // permission e status
          if ((permission) && (status)) {
            console.log('permission,staus')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .where('status', status)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // permission e name
          if ((permission) && (name)) {
            console.log('permission, name')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // status e name
          if ((status) && (name)) {
            console.log('status, name')// teste
            const data = await User
              .query()
              .where('status', status)
              .where('name', 'like', name + '%')
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // apenas permission
          if (permission) {
            console.log('permission')// teste
            const data = await User
              .query()
              .where('permission', permission)
              .orderBy('name')
              .paginate(page, pageSize)
            return data
          }

          // apenas name
          if (name) {
            console.log('name')// teste
            const data = [
              await User.query().where('name', 'like', name + '%').orderBy('name').paginate(page, pageSize),
              await Fornecedor.query().where('name', 'like', name + '%').orderBy('name').paginate(page, pageSize)
            ]
            return data
          }

          // apenas status
          if (status) {
            console.log('status')// teste
            const data = [
              await User.query().where('status', status).orderBy('name').paginate(page, pageSize),
              await Fornecedor.query().where('status', status).orderBy('name').paginate(page, pageSize)
            ]
            return data
          }
        }
      }
    } catch (error) {
      return response.status(400).json('Permissão negada')
    }
  }
}

module.exports = FilterController
