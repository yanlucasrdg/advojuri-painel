import { apiRequest } from './api'
import type {
  BuscaResponse,
  Monitoramento,
  MonitoramentoCriado,
  Processo,
  RecargaResponse,
  SaldoResponse,
  SignupResponse,
  TipoBusca,
} from '../types'

export function signup(nome: string, email: string): Promise<SignupResponse> {
  return apiRequest('/v1/auth/signup', {
    method: 'POST',
    body: { nome, email },
    autenticado: false,
  })
}

export function obterSaldo(): Promise<SaldoResponse> {
  return apiRequest('/v1/saldo')
}

export function recarregarSaldo(valorCentavos: number): Promise<RecargaResponse> {
  return apiRequest('/v1/saldo/recarga', {
    method: 'POST',
    body: { valor_centavos: valorCentavos },
  })
}

export function consultarProcesso(numeroCnj: string, tribunal: string): Promise<Processo> {
  const numeroLimpo = encodeURIComponent(numeroCnj.trim())
  return apiRequest(`/v1/processos/${numeroLimpo}?tribunal=${encodeURIComponent(tribunal)}`)
}

export function buscar(tipo: TipoBusca, termo: string): Promise<BuscaResponse> {
  const params = new URLSearchParams({ tipo, termo })
  return apiRequest(`/v1/busca?${params.toString()}`)
}

export function listarMonitoramentos(): Promise<Monitoramento[]> {
  return apiRequest('/v1/monitoramentos')
}

export function criarMonitoramento(
  numeroCnj: string,
  tribunal: string,
  webhookUrl: string
): Promise<MonitoramentoCriado> {
  return apiRequest('/v1/monitoramentos', {
    method: 'POST',
    body: { numero_cnj: numeroCnj, tribunal, webhook_url: webhookUrl },
  })
}

export function cancelarMonitoramento(id: string): Promise<void> {
  return apiRequest(`/v1/monitoramentos/${id}`, { method: 'DELETE' })
}
