import { getInscricoesUsuario, inscreverCurso } from '../services/api.js';
import { getUsuarioLogado, podeInscrever } from '../services/auth.js';

export class CursoCard extends HTMLElement {
  set data(curso) {
    this._curso = curso;
    this.render();
  }

  render() {
    if (!this._curso) return;

    const id = this._curso.id_curso ?? this._curso.id;
    const nome = this._curso.nome_curso ?? this._curso.nome;
    const { descricao, vagas, horario, data_inicio, imagem_url } = this._curso;
    const dataInicioFormatada = data_inicio
      ? new Date(`${data_inicio}T00:00:00`).toLocaleDateString('pt-BR')
      : 'A definir';

    this.innerHTML = `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between p-5">
        <div>
          <div class="course-image h-40 bg-orange-100 rounded-xl mb-4 flex items-center justify-center text-4xl overflow-hidden">
            👨‍🍳
          </div>
          <span class="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full mb-2">
            Presencial • Gratuito
          </span>
          <h3 class="font-bold text-gray-800 text-lg mb-1">${nome}</h3>
          <p class="text-gray-500 text-xs mb-4 line-clamp-2">${descricao || 'Capacitação prática e gratuita para a comunidade.'}</p>
          
          <div class="text-xs text-gray-600 space-y-1 mb-4">
            <p>🗓️ <strong>Data de início:</strong> ${dataInicioFormatada}</p>
          </div>
        </div>

        <button data-id="${id}" data-nome="${nome}" class="btn-garantir-vaga w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl text-sm transition">
          Garantir Minha Vaga
        </button>
      </div>
    `;

    const imageContainer = this.querySelector('.course-image');
    if (imagem_url) {
      let imageUrl;
      try {
        imageUrl = new URL(imagem_url, window.location.href);
      } catch {
        imageUrl = null;
      }

      if (imageUrl && ['http:', 'https:'].includes(imageUrl.protocol)) {
        const image = new Image();
        image.alt = `Imagem do curso ${nome}`;
        image.className = 'h-full w-full object-cover';
        image.addEventListener('error', () => {
          image.remove();
          imageContainer.textContent = '👨‍🍳';
        }, { once: true });
        imageContainer.replaceChildren(image);
        image.src = imageUrl.href;
      }
    }

    const button = this.querySelector('.btn-garantir-vaga');
    button.addEventListener('click', async () => {
      if (!podeInscrever()) {
        document.querySelector('app-modal')?.abrirLogin();
        return;
      }
      if (this._inscrito) return;

      button.disabled = true;
      button.textContent = 'Inscrevendo...';
      try {
        const usuario = getUsuarioLogado();
        const response = await inscreverCurso(id, usuario.id_usuario);
        if (!response.ok) {
          const erro = await response.json().catch(() => ({}));
          throw new Error(erro.detail || 'Não foi possível garantir a vaga.');
        }
        this._inscrito = true;
        this.atualizarPermissao();
      } catch (error) {
        alert(error.message);
        button.disabled = false;
        this.atualizarPermissao();
      }
    });
    this.atualizarPermissao();
    this.carregarInscricao();
    window.addEventListener('usuario-alterado', () => this.atualizarPermissao());
  }

  atualizarPermissao() {
    const button = this.querySelector('.btn-garantir-vaga');
    if (!button) return;
    const autenticado = Boolean(getUsuarioLogado());
    const aluno = podeInscrever();
    button.disabled = this._inscrito;
    button.textContent = this._inscrito ? 'Inscrito' : aluno ? 'Garantir Minha Vaga' : autenticado ? 'Disponível apenas para alunos' : 'Entrar para se inscrever';
    button.classList.remove('bg-gray-400', 'hover:bg-orange-700', 'bg-emerald-600', 'hover:bg-emerald-700');
    if (this._inscrito) {
      button.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
    } else if (aluno) {
      button.classList.add('hover:bg-orange-700');
    } else {
      button.classList.add('bg-gray-400');
    }
  }

  async carregarInscricao() {
    this._inscrito = false;
    const usuario = getUsuarioLogado();
    if (!podeInscrever() || !usuario) return;
    const inscricoes = await getInscricoesUsuario(usuario.id_usuario);
    this._inscrito = inscricoes.includes(this._curso.id_curso ?? this._curso.id);
    this.atualizarPermissao();
  }
}

customElements.define('curso-card', CursoCard);