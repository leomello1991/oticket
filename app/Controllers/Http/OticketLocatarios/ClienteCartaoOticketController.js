'use strict'

class ClienteCartaoOticketController {
  // async store ({ request, auth, response }) { // Criando usuários
//     try {
//       const verifyToken = await auth.check() // Checando token

  //       if (!verifyToken) {
  //         return response.status(401).send({ message: 'token invalido' })
  //       }

  //       // Retorna detalhes do usuário logado
  //       const userRegister = await auth.getUser()

  //       // Se for ADMINISTRADOR
  //       if (userRegister.permission.toLowerCase() === 'administrador') {
  //         if (userRegister.status.toLowerCase() === 'ativo') {
  //           const data = {
  //             ...request.only([
  //               'name',
  //               'email',
  //               'cpf',
  //               'celPhone',
  //               'dataNascimento',
  //               'password',
  //               'postalCode',
  //               'street',
  //               'number',
  //               'neighborhood',
  //               'locale',
  //               'ufS',
  //               'locatario_id',
  //               'permission' // clienteCartao
  //             ]),
  //             user_id: request.user_id,
  //             status: 'ativo'
  //           }
  //         }
  //         return response.status(401).json({ message: 'INATIVO!' })
  //       }
  //       return response.status(401).send({ message: 'Permissão negada!' })
  //     } catch (error) {

//     }
//   }
}

module.exports = ClienteCartaoOticketController
