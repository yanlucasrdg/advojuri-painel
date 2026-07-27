import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiRequest, ApiError } from '../api'
import { salvarApiKey, obterApiKey } from '../auth'

function mockFetchOnce(status: number, corpo: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => corpo,
    })
  )
}

describe('apiRequest', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.unstubAllGlobals()
  })

  it('lança erro categoria "auth" sem nem chamar fetch quando não há chave salva', async () => {
    const fetchEspiao = vi.fn()
    vi.stubGlobal('fetch', fetchEspiao)

    await expect(apiRequest('/v1/saldo')).rejects.toMatchObject({ categoria: 'auth' })
    expect(fetchEspiao).not.toHaveBeenCalled()
  })

  it('não exige chave quando autenticado=false (ex: signup)', async () => {
    mockFetchOnce(201, { tenant_id: 'x', api_key: 'ajr_live_novo' })
    const resultado = await apiRequest('/v1/auth/signup', {
      method: 'POST',
      body: { nome: 'a', email: 'a@a.com' },
      autenticado: false,
    })
    expect(resultado).toEqual({ tenant_id: 'x', api_key: 'ajr_live_novo' })
  })

  it('categoriza 402 como saldo_insuficiente', async () => {
    salvarApiKey('ajr_live_teste')
    mockFetchOnce(402, { mensagem: 'Saldo insuficiente' })

    await expect(apiRequest('/v1/saldo')).rejects.toMatchObject({
      categoria: 'saldo_insuficiente',
      message: 'Saldo insuficiente',
    })
  })

  it('categoriza 404 como nao_encontrado', async () => {
    salvarApiKey('ajr_live_teste')
    mockFetchOnce(404, { mensagem: 'Processo não encontrado' })

    await expect(apiRequest('/v1/processos/123')).rejects.toMatchObject({ categoria: 'nao_encontrado' })
  })

  it('401 limpa a sessão (força novo login em vez de ficar preso)', async () => {
    salvarApiKey('ajr_live_revogada')
    mockFetchOnce(401, { mensagem: 'API key inválida ou revogada' })

    await expect(apiRequest('/v1/saldo')).rejects.toMatchObject({ categoria: 'auth' })
    expect(obterApiKey()).toBeNull()
  })

  it('falha de rede (fetch rejeita) vira categoria "rede", não trava sem mensagem', async () => {
    salvarApiKey('ajr_live_teste')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiRequest('/v1/saldo')).rejects.toMatchObject({ categoria: 'rede' })
  })

  it('sucesso retorna o corpo já parseado', async () => {
    salvarApiKey('ajr_live_teste')
    mockFetchOnce(200, { saldo_centavos: 1500, saldo_reais: 15.0 })

    const resultado = await apiRequest('/v1/saldo')
    expect(resultado).toEqual({ saldo_centavos: 1500, saldo_reais: 15.0 })
  })

  it('204 (delete) retorna undefined sem tentar parsear JSON vazio', async () => {
    salvarApiKey('ajr_live_teste')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('sem corpo') } })
    )

    const resultado = await apiRequest('/v1/monitoramentos/abc', { method: 'DELETE' })
    expect(resultado).toBeUndefined()
  })

  it('ApiError carrega a categoria e o status', () => {
    const erro = new ApiError('validacao', 'CPF não suportado', 400)
    expect(erro.categoria).toBe('validacao')
    expect(erro.status).toBe(400)
    expect(erro.message).toBe('CPF não suportado')
  })
})
