'use strict'

const Database = use('Database')

/*
-> Route: sangrias
-> Permissão Comissário: o Comissario vai poder consultar APENAS as sangrias que
  estão cadastradas com seu ID, podendo filtrar pelo STATUS e EVENTO.
  -> STATUS: all, active, canceled.
  -> eventId.
*/

async function showSangriaComissary (response, eventId, comissaryId, page, pageSize, type, idComissary) {
  console.log('aki')
  console.log(eventId, comissaryId, page, pageSize, type, idComissary)
  /* Mostra todas as Sangrias do Comissario Logado */
  if ((comissaryId === '') && (eventId === null)) {
    console.log('Comiss, event=null, comissary=null')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    /* Retorna apenas as sangrias ativas */
    if (type === 'active') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .where('lg.status', 'ativo')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    /* Retorna apenas as sangrias canceladas */
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .where('lg.status', 'cancelado')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
  }
  if ((comissaryId === '') && (eventId)) {
    console.log('Comiss:  event, comissary=null')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .where('lg.evento_id', eventId.id)
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    /* Retorna apenas as sangrias ativas */
    if (type === 'active') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .where('lg.evento_id', eventId.id)
        .where('lg.status', 'ativo')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    /* Retorna apenas as sangrias canceladas */
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', idComissary)
        .where('lg.evento_id', eventId.id)
        .where('lg.status', 'cancelado')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
  }
  if (type === '') {
    return response.status(400).send({ message: 'Nenhum tipo (type) de pesquisa selecionado!' })
  }
}

module.exports = {
  showSangriaComissary
}
