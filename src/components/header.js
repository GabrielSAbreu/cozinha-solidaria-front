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
            <a href="#" id="nav-admin" class="hover:text-orange-600 transition">Painel Admin</a>
          </nav>

          <button id="btn-hero-inscrever" class="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm">
            Inscrever-se em um Curso
          </button>
        </div>
      </header>
    `;

    this.setupEvents();
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

    this.querySelector('#btn-hero-inscrever').addEventListener('click', () => {
      const modal = document.querySelector('app-modal');
      if (modal) modal.abrir('Inscrição Geral');
    });
  }
}

customElements.define('app-header', AppHeader);