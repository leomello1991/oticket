'use strict'

const Database = use('Database')

/*
-> Route: sangrias
-> Permissão Adm: o administrador vai poder consultar TODAS as sangrias podendo
filtrar:
  -> Status: all, active, canceled.
  -> ComissarioId
  -> EventoId
*/
async function showSangriaAdministrator (response, eventId, comissaryId, page, pageSize, type) {
  console.log(eventId, comissaryId, page, pageSize, type)
  /* Mostra TODAS as sangrias */
  if ((comissaryId === '') && (eventId === null)) {
    console.log('Adm, event=null, comissary=null')
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
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
        .where('lg.status', 'cancelado')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
  }
  /* Mostra sangrias de um COMISSÁRIO */
  if ((comissaryId) && (eventId === null)) {
    console.log('Adm, comissary, event=null')
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', comissaryId)
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'active') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', comissaryId)
        .where('lg.status', 'ativo')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.comissario_id', comissaryId)
        .where('lg.status', 'cancelado')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
  }
  /* Mostra as sangrias de um EVENTO */
  if ((eventId) && (comissaryId === '')) {
    console.log('Adm, event, comissary=null')
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.evento_id', eventId.id)
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'active') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.evento_id', eventId.id)
        .where('lg.status', 'ativo')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
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
  /* Mostra as sangrias de um EVENTO e COMISSARIO */
  if ((eventId) && (comissaryId)) {
    console.log('Adm, event, comissary')
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.evento_id', eventId.id)
        .where('lg.comissario_id', comissaryId)
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'active') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.evento_id', eventId.id)
        .where('lg.comissario_id', comissaryId)
        .where('lg.status', 'ativo')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.evento_id', eventId.id)
        .where('lg.comissario_id', comissaryId)
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
  showSangriaAdministrator
}
