import { obterApiKey, limparApiKey } from './auth'

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

/**
 * Erro tipado por categoria, pra cada tela decidir a UI certa sem
 * precisar re-inspecionar status code espalhado pelo código.
 *   - 'rede': fetch falhou antes de chegar resposta (API fora do ar, CORS, DNS)
 *   - 'auth': 401 — chave inválida/revogada
 *   - 'saldo_insuficiente': 402
 *   - 'nao_encontrado': 404
 *   - 'validacao': 400/409 — erro do usuário, a mensagem já vem pronta da API
 *   - 'servidor': 5xx ou qualquer coisa não mapeada
 */
export type CategoriaErro =
  | 'rede'
  | 'auth'
  | 'saldo_insuficiente'
  | 'nao_encontrado'
  | 'validacao'
  | 'servidor'

export class ApiError extends Error {
  categoria: CategoriaErro
  status: number | null

  constructor(categoria: CategoriaErro, mensagem: string, status: number | null = null) {
    super(mensagem)
    this.categoria = categoria
    this.status = status
  }
}

function categorizarStatus(status: number): CategoriaErro {
  if (status === 401) return 'auth'
  if (status === 402) return 'saldo_insuficiente'
  if (status === 404) return 'nao_encontrado'
  if (status === 400 || status === 409 || status === 422) return 'validacao'
  return 'servidor'
}

interface OpcoesRequisicao {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  autenticado?: boolean
}

export async function apiRequest<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { method = 'GET', body, autenticado = true } = opcoes

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (autenticado) {
    const chave = obterApiKey()
    if (!chave) {
      throw new ApiError('auth', 'Nenhuma API key encontrada nesta sessão. Faça login novamente.')
    }
    headers.Authorization = `Bearer ${chave}`
  }

  let resposta: Response
  try {
    resposta = await fetch(`${API_BASE_URL}${caminho}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'rede',
      'Não foi possível conectar à API. Verifique se o backend está rodando e acessível.'
    )
  }

  if (!resposta.ok) {
    const categoria = categorizarStatus(resposta.status)

    if (categoria === 'auth') {
      // Chave inválida/revogada: limpa a sessão pra forçar novo login,
      // em vez de deixar o usuário preso numa sessão que nunca vai funcionar.
      limparApiKey()
    }

    let mensagem = `Erro ${resposta.status}`
    try {
      const corpo = await resposta.json()
      mensagem = corpo.mensagem ?? corpo.detail ?? mensagem
    } catch {
      // corpo não é JSON — mantém a mensagem genérica
    }

    throw new ApiError(categoria, mensagem, resposta.status)
  }

  if (resposta.status === 204) {
    return undefined as T
  }

  return (await resposta.json()) as T
}
