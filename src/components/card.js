export class CursoCard extends HTMLElement {
  set data(curso) {
    this._curso = curso;
    this.render();
  }

  render() {
    if (!this._curso) return;

    const { id, nome, descricao, vagas, horario, dia_semana } = this._curso;

    this.innerHTML = `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between p-5">
        <div>
          <div class="h-40 bg-orange-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
            👨‍🍳
          </div>
          <span class="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full mb-2">
            Presencial • Gratuito
          </span>
          <h3 class="font-bold text-gray-800 text-lg mb-1">${nome}</h3>
          <p class="text-gray-500 text-xs mb-4 line-clamp-2">${descricao || 'Capacitação prática e gratuita para a comunidade.'}</p>
          
          <div class="text-xs text-gray-600 space-y-1 mb-4">
            <p>🗓️ <strong>Dia:</strong> ${dia_semana || 'A definir'}</p>
            <p>⏰ <strong>Horário:</strong> ${horario || 'A definir'}</p>
            <p>👥 <strong>Vagas Restantes:</strong> ${vagas ?? 'Ilimitadas'}</p>
          </div>
        </div>

        <button data-id="${id}" data-nome="${nome}" class="btn-garantir-vaga w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl text-sm transition">
          Garantir Minha Vaga
        </button>
      </div>
    `;

    this.querySelector('.btn-garantir-vaga').addEventListener('click', () => {
      const modal = document.querySelector('app-modal');
      if (modal) modal.abrir(nome);
    });
  }
}

customElements.define('curso-card', CursoCard);