const API_URL = 'http://localhost:8000';

/**
 * Busca a lista de todas as oficinas/cursos cadastrados.
 * @returns {Promise<Array>} Lista de cursos ou array vazio em caso de erro.
 */
export async function getCursos() {
  try {
    const response = await fetch(`${API_URL}/cursos`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar cursos: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro no serviço getCursos:", error);
    return [];
  }
}

export async function getBeneficios() {
  try {
    const response = await fetch(`${API_URL}/beneficios`);
    if (!response.ok) throw new Error(`Erro ao buscar benefícios: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Erro no serviço getBeneficios:", error);
    return [];
  }
}

export async function getAlunos(idUsuario) {
  try {
    const response = await fetch(`${API_URL}/usuarios/alunos`, {
      headers: { 'X-User-Id': String(idUsuario) }
    });
    if (!response.ok) throw new Error(`Erro ao buscar alunos: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Erro no serviço getAlunos:", error);
    return [];
  }
}

export async function getBeneficiosUsuario(idUsuario) {
  try {
    const response = await fetch(`${API_URL}/beneficios/usuario/${idUsuario}`, {
      headers: { 'X-User-Id': String(idUsuario) }
    });
    if (!response.ok) throw new Error(`Erro ao buscar benefícios: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Erro no serviço getBeneficiosUsuario:", error);
    return [];
  }
}

export async function cadastrarCurso(dadosCurso, userId) {
  return fetch(`${API_URL}/cursos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId)
    },
    body: JSON.stringify(dadosCurso)
  });
}

export async function cadastrarBeneficio(dadosBeneficio, userId) {
  return fetch(`${API_URL}/beneficios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId)
    },
    body: JSON.stringify(dadosBeneficio)
  });
}

export async function editarCurso(idCurso, dadosCurso, userId) {
  return fetch(`${API_URL}/cursos/${idCurso}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId)
    },
    body: JSON.stringify(dadosCurso)
  });
}

export async function editarBeneficio(idBeneficio, dadosBeneficio, userId) {
  return fetch(`${API_URL}/beneficios/${idBeneficio}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId)
    },
    body: JSON.stringify(dadosBeneficio)
  });
}

/**
 * Realiza o cadastro de um novo aluno (inscrição na oficina).
 * @param {Object} dadosAluno - Objeto com os dados do formulário (nome, email, telefone, endereço, etc).
 * @returns {Promise<Response>} Retorna a resposta HTTP da API.
 */
export async function cadastrarAluno(dadosAluno) {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...dadosAluno,
        tipo_usuario: dadosAluno.tipo_usuario || 'aluno'
      })
    });
    return response;
  } catch (error) {
    console.error("Erro no serviço cadastrarAluno:", error);
    throw error;
  }
}

export async function loginUsuario(email, senha) {
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });
    return response;
  } catch (error) {
    console.error("Erro no serviço loginUsuario:", error);
    throw error;
  }
}

export async function getInscricoesUsuario(idUsuario) {
  try {
    const response = await fetch(`${API_URL}/cursos/inscricoes/${idUsuario}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar inscrições do usuário:", error);
    return [];
  }
}

export async function inscreverCurso(idCurso, idUsuario) {
  return fetch(`${API_URL}/cursos/${idCurso}/inscricao`, {
    method: 'POST',
    headers: {
      'X-User-Id': String(idUsuario)
    }
  });
}

export async function cadastrarAdmin(dadosAdmin, userId) {
  try {
    const response = await fetch(`${API_URL}/usuarios/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': String(userId)
      },
      body: JSON.stringify({ ...dadosAdmin, tipo_usuario: 'admin' })
    });
    return response;
  } catch (error) {
    console.error("Erro no serviço cadastrarAdmin:", error);
    throw error;
  }
}

/**
 * Remove uma oficina pelo ID (Requer cabeçalho com X-User-Id de perfil Root).
 * @param {number|string} idCurso - ID do curso a ser excluído.
 * @param {number|string} userId - ID do usuário realizando a ação (ex: 1 para Root).
 * @returns {Promise<Response>} Retorna a resposta HTTP da API.
 */
export async function deletarCurso(idCurso, userId) {
  try {
    const response = await fetch(`${API_URL}/cursos/${idCurso}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': String(userId)
      }
    });
    return response;
  } catch (error) {
    console.error("Erro no serviço deletarCurso:", error);
    throw error;
  }
}

export async function deletarUsuario(idUsuario, userId) {
  try {
    return await fetch(`${API_URL}/usuarios/${idUsuario}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': String(userId)
      }
    });
  } catch (error) {
    console.error("Erro no serviço deletarUsuario:", error);
    throw error;
  }
}
