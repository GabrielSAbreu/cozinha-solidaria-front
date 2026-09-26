const SESSION_KEY = 'cozinha-solidaria-usuario';

export function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function salvarUsuario(usuario) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
  window.dispatchEvent(new CustomEvent('usuario-alterado'));
}

export function sair() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('usuario-alterado'));
}

export function podeInscrever(usuario = getUsuarioLogado()) {
  return usuario?.tipo_usuario?.toLowerCase() === 'aluno';
}

export function podeAdministrar(usuario = getUsuarioLogado()) {
  return ['admin', 'root'].includes(usuario?.tipo_usuario?.toLowerCase());
}