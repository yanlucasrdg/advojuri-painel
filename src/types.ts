// Espelha app/schemas/*.py do backend FastAPI (advojuri-api).
// Manter em sincronia manual por enquanto — não há geração automática
// de tipos a partir do OpenAPI ainda (ver README, seção "próximos passos").

export interface Parte {
  nome: string
  documento: string | null
  tipo_pessoa: string | null
  polo: string | null
}

export interface Movimento {
  data_movimento: string
  descricao: string
  codigo_cnj: string | null
}

export interface Processo {
  numero_cnj: string
  tribunal: string
  classe: string | null
  assunto: string | null
  orgao_julgador: string | null
  valor_acao: number | null
  data_ajuizamento: string | null
  segredo_justica: boolean
  partes: Parte[]
  movimentos: Movimento[]
  atualizado_em: string
}

export type ConfiancaMatch = 'exata' | 'provavel'

export interface ResultadoBusca {
  processo: Processo
  confianca_match: ConfiancaMatch
}

export type TipoBusca = 'numero_cnj' | 'cnpj' | 'nome'

export interface BuscaResponse {
  tipo_busca: TipoBusca
  termo_resolvido: string | null
  tribunais_pesquisados: string[]
  resultados: ResultadoBusca[]
  aviso: string | null
}

export interface SaldoResponse {
  saldo_centavos: number
  saldo_reais: number
}

export interface RecargaResponse {
  transacao_id: string
  saldo_apos_centavos: number
  status: string
}

export interface Monitoramento {
  id: string
  processo_id: string
  webhook_url: string
  ativo: boolean
  ultima_verificacao_em: string | null
  criado_em: string
}

export interface MonitoramentoCriado extends Monitoramento {
  webhook_secret: string
}

export interface SignupResponse {
  tenant_id: string
  api_key: string
}

export const TRIBUNAIS = [
  'STF', 'STJ', 'TST', 'TSE',
  'TRF1', 'TRF2', 'TRF3', 'TRF4', 'TRF5', 'TRF6',
  'TJSP', 'TJRJ', 'TJMG', 'TJCE',
] as const
