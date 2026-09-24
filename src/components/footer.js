export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-gray-900 text-gray-400 py-12 mt-16 border-t border-gray-800">
        <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🍲</span>
              <span class="font-bold text-white text-lg">Cozinha Solidária</span>
            </div>
            <p class="text-xs leading-relaxed">
              Iniciativa social focada no combate à fome e capacitação profissional na área gastronómica.
            </p>
          </div>

          <div>
            <h4 class="text-white text-sm font-semibold mb-3">Contacto</h4>
            <p class="text-xs">📍 Porto Alegre, RS</p>
            <p class="text-xs mt-1">📧 contato@cozinhasolidaria.org</p>
          </div>

          <div>
            <h4 class="text-white text-sm font-semibold mb-3">Projeto</h4>
            <p class="text-xs">MVP Sprint II — Desenvolvimento Full-Stack</p>
            <p class="text-xs mt-1 text-gray-500">© 2026 Cozinha Solidária. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);