// sessionStorage em vez de localStorage: a chave expira ao fechar a aba.
// Trade-off deliberado para o MVP — menos conveniente (precisa colar de
// novo a cada sessão de navegador), mas reduz a janela de exposição se
// o dispositivo for compartilhado ou comprometido.

const CHAVE_STORAGE = 'advojuri_api_key'

export function salvarApiKey(chave: string): void {
  sessionStorage.setItem(CHAVE_STORAGE, chave)
}

export function obterApiKey(): string | null {
  return sessionStorage.getItem(CHAVE_STORAGE)
}

export function limparApiKey(): void {
  sessionStorage.removeItem(CHAVE_STORAGE)
}

export function estaAutenticado(): boolean {
  return obterApiKey() !== null
}
