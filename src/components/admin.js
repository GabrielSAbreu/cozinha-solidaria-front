import {
  cadastrarBeneficio,
  cadastrarCurso,
  editarBeneficio,
  editarCurso,
  getBeneficios,
  getAlunos,
  getCursos,
  deletarCurso
} from '../services/api.js';
import { getUsuarioLogado, podeAdministrar } from '../services/auth.js';

export class AdminDashboard extends HTMLElement {
  async connectedCallback() {
    if (!podeAdministrar()) {
      this.innerHTML = '<p class="max-w-6xl mx-auto px-4 py-8 text-center text-red-600">Acesso permitido apenas para administradores.</p>';
      return;
    }

    this.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Painel de Controle Administrador</h1>
          <button id="btn-cadastrar-admin" class="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Cadastrar administrador</button>
        </div>

        <div class="flex gap-2 border-b border-gray-200 mb-6">
          <button type="button" data-aba="gerenciamento" class="btn-aba px-4 py-2 text-sm font-semibold border-b-2 border-orange-600 text-orange-600">Gerenciamento</button>
          <button type="button" data-aba="cadastros" class="btn-aba px-4 py-2 text-sm font-semibold text-gray-500 hover:text-orange-600">Cadastrar cursos e benefícios</button>
        </div>

        <section id="aba-gerenciamento">
        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Total de Alunos</p>
            <p class="text-2xl font-bold text-gray-800 mt-1" id="total-alunos-stat">0</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Oficinas Ativas</p>
            <p class="text-2xl font-bold text-orange-600 mt-1" id="total-oficinas-stat">0</p>
          </div>
          <div class="bg-white p-5 rounded-2xl border shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase">Benefícios cadastrados</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1" id="total-beneficios-stat">0</p>
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
        <div class="bg-white rounded-2xl border shadow-sm p-6 mt-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Alunos e inscrições</h2>
          <div class="overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead><tr class="border-b text-xs font-semibold text-gray-500 uppercase">
              <th class="py-3 px-2">Nome</th><th class="py-3 px-2">Idade</th><th class="py-3 px-2">Cidade</th><th class="py-3 px-2">Curso inscrito</th>
            </tr></thead>
            <tbody id="tabela-alunos" class="text-sm divide-y"><tr><td colspan="4" class="py-4 text-center text-gray-400">Carregando alunos...</td></tr></tbody>
          </table></div>
        </div>
        </section>

        <section id="aba-cadastros" class="hidden">
          <div class="grid lg:grid-cols-2 gap-6">
            <form id="form-curso" class="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
              <div>
                <h2 class="text-lg font-bold text-gray-800">Cadastrar curso</h2>
                <p class="text-sm text-gray-500">Informe os campos exigidos pela API.</p>
              </div>
              <label class="block text-sm font-medium text-gray-700">Nome do curso
                <input name="nome_curso" required minlength="3" maxlength="100" class="w-full border rounded-lg p-2 mt-1" placeholder="Ex.: Curso de panificação">
              </label>
              <label class="block text-sm font-medium text-gray-700">Carga horária (horas)
                <input type="number" name="carga_horaria" required min="1" class="w-full border rounded-lg p-2 mt-1" placeholder="40">
              </label>
              <label class="block text-sm font-medium text-gray-700">Data de início
                <input type="date" name="data_inicio" required class="w-full border rounded-lg p-2 mt-1">
              </label>
              <label class="block text-sm font-medium text-gray-700">URL da imagem do curso (opcional)
                <input type="url" name="imagem_url" maxlength="2048" class="w-full border rounded-lg p-2 mt-1" placeholder="https://exemplo.com/imagem.jpg">
              </label>
              <div class="flex gap-2">
                <button type="submit" class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg">Cadastrar curso</button>
                <button type="button" id="btn-cancelar-edicao-curso" class="hidden px-4 border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</button>
              </div>
            </form>

            <form id="form-beneficio" class="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
              <div>
                <h2 class="text-lg font-bold text-gray-800">Cadastrar benefício</h2>
                <p class="text-sm text-gray-500">O benefício poderá ser entregue na data informada.</p>
              </div>
              <label class="block text-sm font-medium text-gray-700">Nome do benefício
                <input name="nome_beneficio" required minlength="3" maxlength="100" class="w-full border rounded-lg p-2 mt-1" placeholder="Ex.: Cesta básica">
              </label>
              <label class="block text-sm font-medium text-gray-700">Descrição
                <textarea name="descricao" required minlength="3" maxlength="255" class="w-full border rounded-lg p-2 mt-1" rows="3" placeholder="Descreva o benefício"></textarea>
              </label>
              <label class="block text-sm font-medium text-gray-700">Data de entrega
                <input type="date" name="data_entrega" required class="w-full border rounded-lg p-2 mt-1">
              </label>
              <div class="flex gap-2">
                <button type="submit" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg">Cadastrar benefício</button>
                <button type="button" id="btn-cancelar-edicao-beneficio" class="hidden px-4 border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</button>
              </div>
            </form>
          </div>
          <div class="bg-white rounded-2xl border shadow-sm p-6 mt-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Benefícios cadastrados</h2>
            <div id="lista-beneficios" class="text-sm text-gray-500">Carregando benefícios...</div>
          </div>
        </section>
      </div>
    `;

    this.querySelector('#btn-cadastrar-admin').addEventListener('click', () => {
      document.querySelector('app-modal')?.abrirCadastroAdmin();
    });
    this.querySelectorAll('.btn-aba').forEach(button => {
      button.addEventListener('click', () => this.mostrarAba(button.dataset.aba));
    });
    this.configurarCadastros();
    await this.carregarTabela();
    await this.carregarAlunos();
    await this.carregarBeneficios();
  }

  mostrarAba(aba) {
    const gerenciamento = aba === 'gerenciamento';
    this.querySelector('#aba-gerenciamento').classList.toggle('hidden', !gerenciamento);
    this.querySelector('#aba-cadastros').classList.toggle('hidden', gerenciamento);
    this.querySelectorAll('.btn-aba').forEach(button => {
      const ativo = button.dataset.aba === aba;
      button.classList.toggle('border-b-2', ativo);
      button.classList.toggle('border-orange-600', ativo);
      button.classList.toggle('text-orange-600', ativo);
      button.classList.toggle('text-gray-500', !ativo);
    });
  }

  configurarCadastros() {
    const userId = getUsuarioLogado().id_usuario;
    const formCurso = this.querySelector('#form-curso');
    const formBeneficio = this.querySelector('#form-beneficio');

    formCurso.addEventListener('submit', async event => {
      event.preventDefault();
      const dados = Object.fromEntries(new FormData(event.currentTarget).entries());
      dados.carga_horaria = Number(dados.carga_horaria);
      const editando = event.currentTarget.dataset.editingId;
      const requisicao = editando
        ? () => editarCurso(editando, dados, userId)
        : () => cadastrarCurso(dados, userId);
      const salvo = await this.enviarCadastro(requisicao, event.currentTarget, editando ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!');
      if (!salvo) return;
      delete event.currentTarget.dataset.editingId;
      this.resetarEdicao(formCurso, 'Cadastrar curso', 'btn-cancelar-edicao-curso');
      this.carregarTabela();
    });
    formBeneficio.addEventListener('submit', async event => {
      event.preventDefault();
      const dados = Object.fromEntries(new FormData(event.currentTarget).entries());
      const editando = event.currentTarget.dataset.editingId;
      const requisicao = editando
        ? () => editarBeneficio(editando, dados, userId)
        : () => cadastrarBeneficio(dados, userId);
      const salvo = await this.enviarCadastro(requisicao, event.currentTarget, editando ? 'Benefício atualizado com sucesso!' : 'Benefício cadastrado com sucesso!');
      if (!salvo) return;
      delete event.currentTarget.dataset.editingId;
      this.resetarEdicao(formBeneficio, 'Cadastrar benefício', 'btn-cancelar-edicao-beneficio');
      this.carregarBeneficios();
    });
    this.querySelector('#btn-cancelar-edicao-curso').addEventListener('click', () => this.resetarEdicao(formCurso, 'Cadastrar curso', 'btn-cancelar-edicao-curso'));
    this.querySelector('#btn-cancelar-edicao-beneficio').addEventListener('click', () => this.resetarEdicao(formBeneficio, 'Cadastrar benefício', 'btn-cancelar-edicao-beneficio'));
  }

  resetarEdicao(form, textoBotao, idBotaoCancelar) {
    delete form.dataset.editingId;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = textoBotao;
    this.querySelector(`#${idBotaoCancelar}`).classList.add('hidden');
  }

  editarCursoNoFormulario(curso) {
    const form = this.querySelector('#form-curso');
    form.dataset.editingId = curso.id_curso;
    form.elements.nome_curso.value = curso.nome_curso;
    form.elements.carga_horaria.value = curso.carga_horaria;
    form.elements.data_inicio.value = curso.data_inicio || '';
    form.elements.imagem_url.value = curso.imagem_url || '';
    form.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
    this.querySelector('#btn-cancelar-edicao-curso').classList.remove('hidden');
    this.mostrarAba('cadastros');
    form.elements.nome_curso.focus();
  }

  editarBeneficioNoFormulario(beneficio) {
    const form = this.querySelector('#form-beneficio');
    form.dataset.editingId = beneficio.id_beneficio;
    form.elements.nome_beneficio.value = beneficio.nome_beneficio;
    form.elements.descricao.value = beneficio.descricao;
    form.elements.data_entrega.value = beneficio.data_entrega;
    form.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
    this.querySelector('#btn-cancelar-edicao-beneficio').classList.remove('hidden');
    this.mostrarAba('cadastros');
    form.elements.nome_beneficio.focus();
  }

  async enviarCadastro(requisicao, form, mensagem) {
    try {
      const response = await requisicao();
      if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        alert(erro.detail || 'Não foi possível concluir o cadastro.');
        return false;
      }
      alert(mensagem);
      form.reset();
      return true;
    } catch (error) {
      alert('Não foi possível conectar ao servidor.');
      return false;
    }
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
          <td class="py-3 px-2 font-semibold text-gray-800">${c.nome_curso}</td>
          <td class="py-3 px-2 text-gray-600">${c.carga_horaria} horas</td>
          <td class="py-3 px-2 text-gray-600">ID ${c.id_curso}</td>
          <td class="py-3 px-2 text-right">
            <button data-id="${c.id_curso}" data-nome="${c.nome_curso}" data-carga="${c.carga_horaria}" data-data="${c.data_inicio || ''}" title="Editar curso" aria-label="Editar curso" class="btn-editar-curso text-orange-600 hover:text-orange-800 text-lg px-2">✎</button>
            <button data-id="${c.id_curso}" title="Excluir curso" aria-label="Excluir curso" class="btn-deletar text-red-600 hover:text-red-800 text-lg px-2">⌫</button>
          </td>
        </tr>
      `).join('');

      this.querySelectorAll('.btn-deletar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm(`Confirma a exclusão da oficina ID ${id}?`)) {
            const usuario = getUsuarioLogado();
            const res = await deletarCurso(id, usuario.id_usuario);
            if (res.ok) {
              alert('Oficina excluída com sucesso!');
              this.carregarTabela();
            } else {
              alert('Erro de permissão ou falha ao excluir.');
            }
          }
        });
      });

      this.querySelectorAll('.btn-editar-curso').forEach(btn => {
        btn.addEventListener('click', async () => {
          const curso = cursos.find(item => String(item.id_curso) === btn.dataset.id);
          if (curso) this.editarCursoNoFormulario(curso);
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  async carregarBeneficios() {
    const container = this.querySelector('#lista-beneficios');
    const beneficios = await getBeneficios();
    this.querySelector('#total-beneficios-stat').textContent = beneficios.length;
    if (!beneficios.length) {
      container.textContent = 'Nenhum benefício cadastrado.';
      return;
    }
    container.innerHTML = beneficios.map(beneficio => `
      <div class="flex items-center justify-between gap-4 border-b last:border-b-0 py-3">
        <div><strong class="text-gray-800">${beneficio.nome_beneficio}</strong><p>${beneficio.descricao}</p></div>
        <button data-id="${beneficio.id_beneficio}" data-nome="${beneficio.nome_beneficio}" data-descricao="${beneficio.descricao}" data-data="${beneficio.data_entrega}" title="Editar benefício" aria-label="Editar benefício" class="btn-editar-beneficio text-orange-600 hover:text-orange-800 text-lg px-2">✎</button>
        <time class="whitespace-nowrap">${beneficio.data_entrega}</time>
      </div>
    `).join('');
    this.querySelectorAll('.btn-editar-beneficio').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editarBeneficioNoFormulario({
          id_beneficio: btn.dataset.id,
          nome_beneficio: btn.dataset.nome,
          descricao: btn.dataset.descricao,
          data_entrega: btn.dataset.data
        });
      });
    });
  }

  async carregarAlunos() {
    const tbody = this.querySelector('#tabela-alunos');
    const alunos = await getAlunos(getUsuarioLogado().id_usuario);
    this.querySelector('#total-alunos-stat').textContent = alunos.length;
    if (!alunos.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-400">Nenhum aluno cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = alunos.map(aluno => `
      <tr><td class="py-3 px-2 font-semibold text-gray-800">${aluno.nome}</td>
      <td class="py-3 px-2">${aluno.idade} anos</td><td class="py-3 px-2">${aluno.cidade}</td>
      <td class="py-3 px-2">${aluno.curso}</td></tr>
    `).join('');
  }
}

customElements.define('admin-dashboard', AdminDashboard);