'use strict'

const Encryption = use('Encryption')
const Exceptions = require('../../../Exceptions/CustomException')
const IngressoHistTransferencia = use('App/Models/IngressoHistTransferencia')
const Ingresso = use('App/Models/Ingresso')
const Lote = use('App/Models/Lote')
const Evento = use('App/Models/Evento')
// const Database = use('Database')

class IngressoHistTransferenciaController {
  /*
  -> Route: transferTickets
  -> SITE/ADM
  -> Transferencia de Ingressos
  */
  async tranferTickets ({ request, response, auth }) {
    try {
      const verifyToken = await auth.check() // Verifica token

      if (!verifyToken) {
        return response.status(401).json({ message: 'Token inválido' })
      }

      // Retorna detalhes do usuário logado
      const userRegister = await auth.getUser()

      /* Ver permissões */

      if ((userRegister.permission === 'administrador') || (userRegister.permission === 'comissario') ||
          (userRegister.permission === 'cliente')) {
        const data = request.all('idTicket', 'cpf', 'nome', 'sobrenome', 'genero', 'email', 'dataNascimento')

        /* Guardar o CPF antigo antes que seja sobre-escrito */
        const ingresso = await Ingresso.findBy('id', data.idTicket)
        const oldCpf = ingresso.cpf

        /* Verifica se ingresso já foi transferido */
        if (ingresso.status === true) {
          return response.status(400).send({ message: 'Operação Negada! Este ingresso já foi transferido!' })
        }

        console.log('Evento do Ingresso:' + ingresso.evento_id)

        /* Checar se CPF já está cadastrado em outro ingresso do mesmo evento */
        const searchCPF = await Ingresso
          .query()
          .where('cpf', data.cpf)
          .where('evento_id', ingresso.evento_id)
          .first()

        console.log('evento do Search: ' + searchCPF)
        if (searchCPF) {
          return response.status(400).send({ message: 'Este cpf já esta cadastrado em outro Ingresso deste Evento!' })
        }

        /* Verifica se ingresso já foi transferido */
        if (ingresso.status === true) {
          return response.status(400).send({ message: 'Operação Negada! Este ingresso já foi transferido!' })
        }

        /* Captando dados para guardar no QrCode */
        const lote = await Lote.findBy('id', ingresso.lote_id)
        const evento = await Evento.findBy('id', ingresso.evento_id)

        const newQrCode =
        `Lote: ${lote.nome}\n
        Tipo Lote: ${lote.tipoLote}\n
        Evento: ${evento.nome}\n
        Hora: ${evento.horaInicio}\n
        Cliente: ${data.nome}\n
        CPF: ${data.cpf}`

        // Criptografrando para guardar no banco de dados.
        const dataEncrypted = await Encryption.encrypt(newQrCode)
        console.log('tamanho da string: ' + dataEncrypted.length)
        /* Fim capta dados para QrCode */

        const histTransfer = new IngressoHistTransferencia()
        histTransfer.qrCode = dataEncrypted
        histTransfer.cpf = oldCpf
        histTransfer.ingresso_id = data.idTicket
        histTransfer.user_id = userRegister.id
        await histTransfer.save()

        await Ingresso
          .query()
          .where('id', data.idTicket)
          .update({
            qrCode: dataEncrypted,
            nome: data.nome,
            cpf: data.cpf,
            dataNascimento: data.dataNascimento,
            email: data.email,
            sobrenome: data.sobrenome,
            genero: data.genero,
            user_id: userRegister.id,
            status: 1,
            iht_id: histTransfer.id
          })

        return response.status(200).send({ message: 'Transferência realizada com sucesso' })
      } else {
        return response.status(401).send({ message: 'Permissão negada!' })
      }
    } catch (error) {
      const message = Exceptions.errorVerify(error)
      response.status(400).send({ message })
    }
  }

  // ------------------------------------------------------------------------ //

  async showTransferTickets ({ request, response, view }) {
    /*
    -> ADM
    -> Route: showTranferTickets
    -> Retorna dados da Tabela IngressoHistTransferencia
    -> Filtro por CPF
    */

    const { cpf, page, pageSize } = request.get()
    if (cpf) {
      const ingressos = await Ingresso
        .query()
        .with('iht')
        .select('id')
        .select('cpf')
        .select('dataNascimento')
        .select('nome')
        .select('sobrenome')
        .select('genero')
        .select('email')
        .select('evento_id')
        .select('lote_id')
        .select('status')
        .where('cpf', 'like', cpf + '%')
        .where('situacao', 'utilizado')
        .orderBy('id')
        .paginate(page, pageSize)
      return ingressos
    } else {
      const ingressos = await Ingresso
        .query()
        .with('iht')
        .select('id')
        .select('cpf')
        .select('dataNascimento')
        .select('nome')
        .select('sobrenome')
        .select('genero')
        .select('email')
        .select('evento_id')
        .select('lote_id')
        .select('status')
        .where('situacao', 'utilizado')
        .orderBy('id')
        .paginate(page, pageSize)
      return ingressos
    }

  //   if (cpf) {
  //     const dataTicket = await Database
  //       .from('ingressos as i')
  //       .innerJoin('ingresso_hist_transferencias as iht', 'iht.ingresso_id', 'i.id')
  //       .innerJoin('lotes as l', 'l.id', 'i.lote_id')
  //       .innerJoin('eventos as e', 'e.id', 'i.evento_id')
  //       .select(
  //         'i.id as TicketId',
  //         'i.cpf as TicketCpf',
  //         'i.nome as TicketName',
  //         'i.sobrenome as TicketSurname',
  //         'i.email as TicketEmail',
  //         'i.dataNascimento as TicketDateBirth',
  //         'iht.id as TransferTicketsId',
  //         'iht.cpf as OldClientCpf',
  //         'l.nome as NameLote',
  //         'e.nomeSite as NameEvent '
  //       )
  //       .where('i.cpf', cpf)
  //       .where('i.situacao', 'utilizado')
  //       .paginate(page, pageSize)
  //     return dataTicket
  //   } else {
  //     const dataTicket = await Database
  //       .from('ingressos as i')
  //       .innerJoin('ingresso_hist_transferencias as iht', 'i.id', 'iht.ingresso_id')
  //       .innerJoin('lotes as l', 'l.id', 'i.lote_id')
  //       .innerJoin('eventos as e', 'e.id', 'i.evento_id')
  //       .select(
  //         'i.id as TicketId',
  //         'i.cpf as TicketCpf',
  //         'i.nome as TicketName',
  //         'i.sobrenome as TicketSurname',
  //         'i.email as TicketEmail',
  //         'i.dataNascimento as TicketDateBirth',
  //         'iht.id as TransferTicketsId',
  //         'iht.cpf as OldClientCpf',
  //         'l.nome as NameLote',
  //         'e.nomeSite as NameEvent '
  //       )
  //       .where('i.situacao', 'utilizado')
  //       .paginate(page, pageSize)
  //     return dataTicket
  //   }
  }
}

module.exports = IngressoHistTransferenciaController
