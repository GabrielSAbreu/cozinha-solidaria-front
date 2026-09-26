import { getUsuarioLogado, podeAdministrar, sair } from '../services/auth.js';

export class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2 cursor-pointer" id="logo-btn">
            <span class="text-2xl">🍲</span>
            <span class="font-bold text-gray-800 text-lg">Cozinha<span class="text-orange-600">Solidária</span></span>
          </div>

          <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" id="nav-inicio" class="hover:text-orange-600 transition">Início</a>
            <a href="#cursos" id="nav-cursos" class="hover:text-orange-600 transition">Oficinas & Cursos</a>
            <a href="#" id="nav-admin" class="hidden hover:text-orange-600 transition">Dashboard</a>
            <a href="#" id="nav-beneficios" class="hidden hover:text-orange-600 transition">Meus benefícios</a>
          </nav>

          <button id="btn-login" class="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm">
            Entrar
          </button>
        </div>
      </header>
    `;

    this.setupEvents();
    this.atualizarUsuario();
    window.addEventListener('usuario-alterado', () => this.atualizarUsuario());
  }

  atualizarUsuario() {
    const usuario = getUsuarioLogado();
    const navAdmin = this.querySelector('#nav-admin');
    const navBeneficios = this.querySelector('#nav-beneficios');
    const loginButton = this.querySelector('#btn-login');
    if (podeAdministrar(usuario)) navAdmin.classList.remove('hidden');
    else navAdmin.classList.add('hidden');
    if (usuario?.tipo_usuario?.toLowerCase() === 'beneficiario') navBeneficios.classList.remove('hidden');
    else navBeneficios.classList.add('hidden');
    loginButton.textContent = usuario ? `Sair (${usuario.nome})` : 'Entrar';
  }

  setupEvents() {
    this.querySelector('#logo-btn').addEventListener('click', () => window.location.reload());
    this.querySelector('#nav-inicio').addEventListener('click', () => window.location.reload());

    // Scroll suave para a seção de cursos
    this.querySelector('#nav-cursos').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#grid-cursos')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Alterna para a visão Admin (SPA)
    this.querySelector('#nav-admin').addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('#app-content');
      if (mainContent) {
        mainContent.innerHTML = `<admin-dashboard></admin-dashboard>`;
      }
    });

    this.querySelector('#nav-beneficios').addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('#app-content');
      if (mainContent) mainContent.innerHTML = '<beneficiario-dashboard></beneficiario-dashboard>';
    });

    this.querySelector('#btn-login').addEventListener('click', () => {
      const usuario = getUsuarioLogado();
      if (usuario) {
        sair();
        window.location.reload();
        return;
      }
      const modal = document.querySelector('app-modal');
      if (modal) modal.abrirLogin();
    });
  }
}

customElements.define('app-header', AppHeader);