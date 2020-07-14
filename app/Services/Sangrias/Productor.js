'use strict'

const Database = use('Database')

/*
-> Route: sangrias
-> Permissão Produtor: o Produtor vai poder consultar APENAS as sangrias que
  estão cadastradas com seu ID, podendo filtrar pelo STATUS, EVENTO e COMISSARIO.
  -> STATUS: all, active, canceled.
  -> eventId.
  -> comissaryId
*/
async function showSangriaProductor (response, eventId, comissaryId, page, pageSize, type, productorId) {
  console.log('Entrou Service Prod')
  if ((comissaryId === '') && (eventId === null)) {
    console.log('Prod: event=null, comissary=null')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.produtor_id', productorId)
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
        .where('lg.produtor_id', productorId)
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
        .where('lg.produtor_id', productorId)
        .where('lg.status', 'cancelado')
        .paginate(page, pageSize)

      /* Resposta caso dados não sejam encontrados */
      if (sangria.total === '0') {
        return response.status(400).send({ message: 'Nenhum dado encontrado!' })
      }
      return sangria
    }
  }
  if ((eventId === null) && (comissaryId)) {
    console.log('Prod: event=null, comissary')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.produtor_id', productorId)
        .where('lg.comissario_id', comissaryId)
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
        .where('lg.produtor_id', productorId)
        .where('lg.comissario_id', comissaryId)
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
        .where('lg.produtor_id', productorId)
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
  if ((eventId) && (comissaryId === '')) {
    console.log('Prod: event, comissary=null')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.produtor_id', productorId)
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
        .where('lg.produtor_id', productorId)
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
        .where('lg.produtor_id', productorId)
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
  if ((eventId) && (comissaryId)) {
    console.log('Prod: event, comissary=null')
    /* Retorna todas as sangrias cadastradas */
    if (type === 'all') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.produtor_id', productorId)
        .where('lg.evento_id', eventId.id)
        .where('lg.comissario_id', comissaryId)
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
        .where('lg.produtor_id', productorId)
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
    /* Retorna apenas as sangrias canceladas */
    if (type === 'canceled') {
      const sangria = await Database
        .from('log_sangrias as lg')
        .innerJoin('eventos as e', 'e.id', 'lg.evento_id')
        .select('lg.*', 'e.nome as Event')
        .where('lg.produtor_id', productorId)
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
  showSangriaProductor
}
