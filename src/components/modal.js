import { buscarCep } from '../services/viaCep.js';
import { cadastrarAdmin, cadastrarAluno, loginUsuario } from '../services/api.js';
import { getUsuarioLogado, podeAdministrar, salvarUsuario } from '../services/auth.js';

export class ModalInscricao extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button type="button" id="btn-fechar" class="absolute right-4 top-3 text-2xl text-gray-400 hover:text-gray-700" aria-label="Fechar">&times;</button>
          <section id="painel-login">
            <h2 class="text-xl font-bold text-gray-800">Entrar</h2>
            <p class="text-sm text-gray-500 mb-4">Use seu e-mail e senha para acessar as opções disponíveis.</p>
            <form id="form-login" class="space-y-3">
              <input type="email" name="email" required placeholder="E-mail" class="w-full border rounded-lg p-2 text-sm">
              <input type="password" name="senha" required placeholder="Senha" class="w-full border rounded-lg p-2 text-sm">
              <button type="submit" class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">Entrar</button>
            </form>
            <p class="text-sm text-gray-500 text-center mt-4">
              Ainda não tem cadastro?
              <button type="button" id="btn-abrir-cadastro" class="text-orange-600 font-semibold hover:text-orange-700">Cadastre-se</button>
            </p>
          </section>
          <section id="painel-cadastro" class="hidden">
            <h2 class="text-xl font-bold text-gray-800">Criar cadastro</h2>
            <p class="text-sm text-gray-500 mb-4">Preencha seus dados e escolha como deseja participar da plataforma.</p>
            <form id="form-cadastro" class="space-y-3"></form>
            <button type="button" id="btn-voltar-login" class="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Voltar para o login</button>
          </section>
          <section id="painel-inscricao" class="hidden">
            <h2 class="text-xl font-bold text-gray-800">Inscrição na Oficina</h2>
            <p id="nome-oficina" class="text-xs text-orange-600 font-semibold mb-4"></p>
            <form id="form-inscricao" class="space-y-3"></form>
          </section>
          <section id="painel-admin" class="hidden">
            <h2 class="text-xl font-bold text-gray-800">Cadastrar administrador</h2>
            <p class="text-sm text-gray-500 mb-4">O novo usuário terá acesso administrativo ao dashboard.</p>
            <form id="form-admin" class="space-y-3"></form>
          </section>
        </div>
      </div>
    `;

    this.querySelector('#form-inscricao').innerHTML = this.formularioUsuario('aluno');
    this.querySelector('#form-cadastro').innerHTML = this.formularioUsuario('aluno', true);
    this.querySelector('#form-admin').innerHTML = this.formularioUsuario('admin');
    this.setupEvents();
  }

  formularioUsuario(tipo, permitirEscolhaTipo = false) {
    return `
      <input type="text" name="nome" required placeholder="Nome completo" class="w-full border rounded-lg p-2 text-sm">
      ${permitirEscolhaTipo ? `
        <fieldset class="space-y-2">
          <legend class="text-sm font-semibold text-gray-700">Como você deseja participar?</legend>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 border rounded-lg p-2 text-sm cursor-pointer">
              <input type="radio" name="tipo_usuario" value="aluno" checked>
              <span>Aluno</span>
            </label>
            <label class="flex items-center gap-2 border rounded-lg p-2 text-sm cursor-pointer">
              <input type="radio" name="tipo_usuario" value="beneficiario">
              <span>Beneficiário</span>
            </label>
          </div>
        </fieldset>
      ` : ''}
      <div class="grid grid-cols-2 gap-2">
        <input type="email" name="email" required placeholder="E-mail" class="w-full border rounded-lg p-2 text-sm">
        <input type="password" name="senha" required placeholder="Senha" class="w-full border rounded-lg p-2 text-sm">
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input type="date" name="data_nascimento" required class="w-full border rounded-lg p-2 text-sm">
        <input type="tel" name="telefone" required placeholder="Telefone" class="w-full border rounded-lg p-2 text-sm">
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <input type="text" name="cep" required maxlength="8" placeholder="CEP" class="w-full border rounded-lg p-2 text-sm">
          <p class="hidden text-xs text-red-600 mt-1" aria-live="polite">CEP incorreto. Verifique e tente novamente.</p>
        </div>
        <input type="text" name="logradouro" required placeholder="Logradouro" class="col-span-2 w-full border rounded-lg p-2 text-sm">
      </div>
      <div class="grid grid-cols-3 gap-2">
        <input type="text" name="numero" required placeholder="Número" class="w-full border rounded-lg p-2 text-sm">
        <input type="text" name="bairro" required placeholder="Bairro" class="w-full border rounded-lg p-2 text-sm">
        <input type="text" name="cidade" required placeholder="Cidade" class="w-full border rounded-lg p-2 text-sm">
      </div>
      <input type="text" name="estado" required placeholder="Estado" class="w-full border rounded-lg p-2 text-sm">
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="btn-cancelar px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancelar</button>
        <button type="submit" class="px-4 py-2 ${tipo === 'admin' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-lg text-sm font-semibold">Cadastrar</button>
      </div>
    `;
  }

  setupEvents() {
    const backdrop = this.querySelector('#backdrop');
    this.querySelector('#btn-fechar').addEventListener('click', () => this.fechar());
    this.querySelector('#btn-abrir-cadastro').addEventListener('click', () => this.mostrarPainel('cadastro'));
    this.querySelector('#btn-voltar-login').addEventListener('click', () => this.mostrarPainel('login'));
    this.querySelectorAll('.btn-cancelar').forEach(button => button.addEventListener('click', () => this.fechar()));

    this.querySelector('#form-login').addEventListener('submit', async (event) => {
      event.preventDefault();
      const dados = Object.fromEntries(new FormData(event.currentTarget).entries());
      try {
        const response = await loginUsuario(dados.email, dados.senha);
        if (!response.ok) {
          alert('E-mail ou senha inválidos.');
          return;
        }
        salvarUsuario(await response.json());
        this.fechar();
        window.location.reload();
      } catch (error) {
        alert('Não foi possível conectar ao servidor.');
      }
    });

    this.configurarCadastro(this.querySelector('#form-inscricao'), false);
    this.configurarCadastro(this.querySelector('#form-cadastro'), false, true);
    this.configurarCadastro(this.querySelector('#form-admin'), true);
    this.querySelectorAll('input[name="cep"]').forEach(input => input.addEventListener('blur', () => this.preencherCep(input)));
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) this.fechar();
    });
  }

  configurarCadastro(form, admin, cadastroInicial = false) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const dados = Object.fromEntries(new FormData(form).entries());
      try {
        const response = admin
          ? await cadastrarAdmin(dados, getUsuarioLogado()?.id_usuario)
          : await cadastrarAluno(dados);
        if (!response.ok) {
          const erro = await response.json().catch(() => ({}));
          alert(erro.detail || 'Não foi possível concluir o cadastro.');
          return;
        }
        if (cadastroInicial) {
          alert('Cadastro realizado com sucesso! Agora você já pode entrar.');
          form.reset();
          this.mostrarPainel('login');
        } else {
          alert(admin ? 'Administrador cadastrado com sucesso!' : 'Inscrição realizada com sucesso!');
          this.fechar();
        }
      } catch (error) {
        alert('Não foi possível conectar ao servidor.');
      }
    });
  }

  async preencherCep(input) {
    const mensagemErro = input.parentElement.querySelector('p');
    if (!input.value.trim()) {
      mensagemErro.classList.add('hidden');
      input.removeAttribute('aria-invalid');
      return;
    }

    const dados = await buscarCep(input.value);
    if (!dados) {
      mensagemErro.classList.remove('hidden');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    mensagemErro.classList.add('hidden');
    input.removeAttribute('aria-invalid');
    const form = input.form;
    form.elements.logradouro.value = dados.logradouro || '';
    form.elements.bairro.value = dados.bairro || '';
    form.elements.cidade.value = dados.localidade || '';
    form.elements.estado.value = dados.uf || '';
  }

  abrirLogin() {
    this.mostrarPainel('login');
  }

  abrir(nomeOficina) {
    if (!getUsuarioLogado()) return this.abrirLogin();
    this.querySelector('#nome-oficina').textContent = nomeOficina;
    this.mostrarPainel('inscricao');
  }

  abrirCadastroAdmin() {
    if (podeAdministrar()) this.mostrarPainel('admin');
  }

  mostrarPainel(nome) {
    ['login', 'cadastro', 'inscricao', 'admin'].forEach(painel => {
      this.querySelector(`#painel-${painel}`).classList.toggle('hidden', painel !== nome);
    });
    const backdrop = this.querySelector('#backdrop');
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
  }

  fechar() {
    const backdrop = this.querySelector('#backdrop');
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
  }
}

customElements.define('app-modal', ModalInscricao);
