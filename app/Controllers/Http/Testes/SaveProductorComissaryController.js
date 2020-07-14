'use strict'

const TestesController = use('././././TestesController')
const User = use('App/Models/User')
const EventoComissario = use('App/Models/EventoComissario')
const EventoProdutore = use('App/Models/EventoProdutore')
const Grupo = use('App/Models/Grupo')

class SaveProductorComissaryController {
  // salva produtores e comissarios em eventos

  async main ({ response, request, auth }) {
    // estes dados vao vir do: EventoController/store
    const { produtores, comissarios, eventoId, userId } = request.all()

    if (produtores) {
      /** Vai guardar na tabela (EventoProdutor) os produtores que estão neste evento. **/
      await this.saveProductor(produtores, eventoId, userId)
    }

    if (comissarios) {
      /** Vai guardar na tabela (EventoProdutor) os produtores que estão neste evento. **/
      await this.saveComissaryGroup(comissarios, eventoId, userId)
    }
  }

  /****************************************************************************/

  async saveProductor (produtores, eventoId, userId) {
    /* Salva produtor na tabela evento_produtores */
    for (let i = 0; i < produtores.length; i++) {
      console.log('produtor:' + produtores[i].nome)

      /* Trasformar nome em id para procurar na tabela de usuarios */
      const searchProdutor = await User
        .query()
        .where('name', produtores[i].nome)
        .where('permission', 'produtor')
        .first()

      /* Save produtor in table evento_produtores */
      console.log('produtor_id: ' + searchProdutor.id)
      console.log('evento_id: ' + eventoId)
      console.log('user_id: ' + userId)
      console.log('==========================================================')

      const eventoProdutor = new EventoProdutore()
      eventoProdutor.produtor_id = searchProdutor.id
      eventoProdutor.evento_id = eventoId
      eventoProdutor.user_id = userId
      await eventoProdutor.save()
    }
  }

  /****************************************************************************/

  async saveComissaryGroup (comissarios, eventoId, userId) {
    /* Salva comissarios e grupos na tabela evento_comissarios */
    for (let i = 0; i < comissarios.length; i++) {
      console.log('comissario: ' + comissarios[i].nomeComissario)

      for (let j = 0; j < comissarios[i].grupos.length; j++) {
        /* Trasformar nome em id para procurar na tabela de usuarios */
        const searchComissario = await User
          .query()
          .where('name', comissarios[i].nomeComissario)
          .where('permission', 'comissario')
          .first()

        /* Trasformar descricao em id para procurar na tabela de grupos */
        const searchGroup = await Grupo.findBy('descricao', comissarios[i].grupos[j].descricao)

        /* Save comissario in table evento_comissarios */
        console.log('comissario_id: ' + searchComissario.id)
        console.log('grupo_id: ' + searchGroup.id)
        console.log('evento_id: ' + eventoId)
        console.log('user_id: ' + userId)
        console.log('status: ativo')
        console.log('data: ' + new Date())
        console.log('==========================================================')

        const eventoComissario = new EventoComissario()
        eventoComissario.comissario_id = searchComissario.id // id do comissário
        eventoComissario.grupo_id = searchGroup.id // id do grupo
        eventoComissario.evento_id = eventoId
        eventoComissario.user_id = userId
        eventoComissario.status = 'ativo'
        eventoComissario.data = new Date() // data atual
        await eventoComissario.save()
      }
    }
  }

  /** *********************************************************************** */

  async ENVIAconexoesController () {
    console.log('aki')
    const a = await TestesController.RECEBEconexoesController(1, 1)
    return a
  }
}

module.exports = SaveProductorComissaryController
