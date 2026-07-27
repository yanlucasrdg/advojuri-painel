import { describe, it, expect, beforeEach } from 'vitest'
import { salvarApiKey, obterApiKey, limparApiKey, estaAutenticado } from '../auth'

describe('auth (sessionStorage helpers)', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('não está autenticado quando não há chave salva', () => {
    expect(estaAutenticado()).toBe(false)
    expect(obterApiKey()).toBeNull()
  })

  it('salva e recupera a chave', () => {
    salvarApiKey('ajr_live_abc123')
    expect(obterApiKey()).toBe('ajr_live_abc123')
    expect(estaAutenticado()).toBe(true)
  })

  it('limpa a chave', () => {
    salvarApiKey('ajr_live_abc123')
    limparApiKey()
    expect(obterApiKey()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })
})
