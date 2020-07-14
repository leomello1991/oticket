'use strict'
const User = use('App/Models/User')
const Fornecedor = use('App/Models/Fornecedor')

class Utils {
  static async returnAllUsers () {
    const data = [
      await User.query().orderBy('name').where('status', 'ativo').whereNot('permission', 'cliente').paginate(),
      await Fornecedor.query().orderBy('name').where('status', 'ativo').paginate()
    ]
    return data
  }

  static convertJasonLowercase (data) {
    const res = JSON.parse(JSON.stringify(data, function (a, b) {
      console.log(b)
      return typeof b === 'string' ? b.toLowerCase() : b
    }))

    return res
  }
}

module.exports = {
  Utils
}
