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
        tipo_usuario: 'aluno' // Força o perfil para aluno conforme as regras do RBAC
      })
    });
    return response;
  } catch (error) {
    console.error("Erro no serviço cadastrarAluno:", error);
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
