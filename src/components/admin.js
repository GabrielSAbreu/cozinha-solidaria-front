import { getCursos, deletarCurso } from '../services/api.js';

export class AdminDashboard extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Painel de Controle Administrador</h1>

        <!-- Cards de Métricas (Figma) -->
        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Total de Alunos</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">1,248</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Oficinas Ativas</p>
            <p class="text-2xl font-bold text-orange-600 mt-1" id="total-oficinas-stat">0</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Refeições Distribuídas</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1">5,230</p>
          </div>
        </div>

        <!-- Tabela de Gestão de Cursos -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Gerenciamento de Oficinas</h2>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b text-xs font-semibold text-gray-500 uppercase">
                  <th class="py-3 px-2">Nome da Oficina</th>
                  <th class="py-3 px-2">Dia</th>
                  <th class="py-3 px-2">Vagas</th>
                  <th class="py-3 px-2 text-right">Ações (RBAC)</th>
                </tr>
              </thead>
              <tbody id="tabela-cursos" class="text-sm divide-y">
                <tr><td colspan="4" class="py-4 text-center text-gray-400">Carregando oficinas...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    await this.carregarTabela();
  }

  async carregarTabela() {
    try {
      const cursos = await getCursos();
      const tbody = this.querySelector('#tabela-cursos');
      this.querySelector('#total-oficinas-stat').textContent = cursos.length;

      if (!cursos || cursos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-gray-400">Nenhuma oficina cadastrada.</td></tr>`;
        return;
      }

      tbody.innerHTML = cursos.map(c => `
        <tr>
          <td class="py-3 px-2 font-semibold text-gray-800">${c.nome}</td>
          <td class="py-3 px-2 text-gray-600">${c.dia_semana || 'N/A'}</td>
          <td class="py-3 px-2 text-gray-600">${c.vagas ?? 'N/A'}</td>
          <td class="py-3 px-2 text-right">
            <button data-id="${c.id}" class="btn-deletar text-red-600 hover:text-red-800 text-xs font-semibold border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
              Excluir (Root)
            </button>
          </td>
        </tr>
      `).join('');

      this.querySelectorAll('.btn-deletar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm(`Confirma a exclusão da oficina ID ${id}?`)) {
            // Simulando X-User-Id do utilizador Root (ex: ID 1 gerado no seeding)
            const rootUserId = 1;
            const res = await deletarCurso(id, rootUserId);
            if (res.ok) {
              alert('Oficina excluída com sucesso!');
              this.carregarTabela();
            } else {
              alert('Erro de permissão ou falha ao excluir.');
            }
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}

customElements.define('admin-dashboard', AdminDashboard);