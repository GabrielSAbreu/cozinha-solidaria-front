import { getBeneficiosUsuario } from '../services/api.js';
import { getUsuarioLogado } from '../services/auth.js';

export class BeneficiarioDashboard extends HTMLElement {
  async connectedCallback() {
    const usuario = getUsuarioLogado();
    this.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-800">Agenda de benefícios</h1>
        <p class="text-sm text-gray-500 mt-1 mb-6">Consulte as datas previstas para entrega dos benefícios.</p>
        <div class="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table class="w-full text-left">
            <thead><tr class="border-b text-xs font-semibold text-gray-500 uppercase">
              <th class="py-3 px-4">Benefício</th><th class="py-3 px-4">Descrição</th><th class="py-3 px-4">Data de entrega</th><th class="py-3 px-4">Status</th>
            </tr></thead>
            <tbody id="tabela-meus-beneficios"><tr><td colspan="4" class="py-8 text-center text-gray-400">Carregando benefícios...</td></tr></tbody>
          </table>
        </div>
      </section>
    `;

    if (!usuario) return;
    const beneficios = await getBeneficiosUsuario(usuario.id_usuario);
    const tabela = this.querySelector('#tabela-meus-beneficios');
    if (!beneficios.length) {
      tabela.innerHTML = '<tr><td colspan="4" class="py-8 text-center text-gray-400">Nenhum benefício disponível.</td></tr>';
      return;
    }
    tabela.innerHTML = beneficios.map(beneficio => `
      <tr class="border-b last:border-b-0">
        <td class="py-3 px-4 font-semibold text-gray-800">${beneficio.nome_beneficio}</td>
        <td class="py-3 px-4 text-gray-600">${beneficio.descricao}</td>
        <td class="py-3 px-4 text-gray-600">${beneficio.data_entrega}</td>
        <td class="py-3 px-4"><span class="inline-block px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">${beneficio.status}</span></td>
      </tr>
    `).join('');
  }
}

customElements.define('beneficiario-dashboard', BeneficiarioDashboard);
