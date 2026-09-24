/**
 * Consulta a API pública do ViaCEP para obter dados de endereço.
 * @param {string} cep - O CEP digitado pelo usuário.
 * @returns {Promise<Object|null>} Retorna os dados do endereço ou null se for inválido/não encontrado.
 */
export async function buscarCep(cep) {
  // Remove caracteres não numéricos do CEP
  const cepLimpo = cep.replace(/\D/g, '');

  // Valida se o CEP possui exatamente 8 dígitos
  if (cepLimpo.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição ViaCEP: ${response.status}`);
    }

    const data = await response.json();

    // A API do ViaCEP retorna { erro: "true" } quando o CEP não é encontrado
    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Falha ao buscar CEP no ViaCEP:", error);
    return null;
  }
}