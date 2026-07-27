import { useState } from 'react'
import { buscar } from '../lib/endpoints'
import { ApiError } from '../lib/api'
import { Aviso } from '../components/Aviso'
import { StampBadge } from '../components/StampBadge'
import { EmptyState } from '../components/EmptyState'
import type { BuscaResponse, TipoBusca } from '../types'

export function Buscar() {
  const [tipo, setTipo] = useState<TipoBusca>('nome')
  const [termo, setTermo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<ApiError | null>(null)
  const [resultado, setResultado] = useState<BuscaResponse | null>(null)

  async function executarBusca(e: React.FormEvent) {
    e.preventDefault()
    if (!termo.trim()) return

    setCarregando(true)
    setErro(null)
    setResultado(null)
    try {
      const resposta = await buscar(tipo, termo.trim())
      setResultado(resposta)
    } catch (err) {
      setErro(err instanceof ApiError ? err : new ApiError('servidor', 'Erro inesperado.'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold">Buscar por nome/CNPJ</h2>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
        Busca por aproximação, não é um match exato como a consulta por número CNJ.
      </p>

      <form onSubmit={executarBusca} className="mt-6 flex gap-2">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoBusca)}
          className="rounded-sm border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--color-line)' }}
        >
          <option value="nome">Nome</option>
          <option value="cnpj">CNPJ</option>
        </select>
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder={tipo === 'cnpj' ? '00.623.904/0001-73' : 'Nome completo'}
          className="flex-1 rounded-sm border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--color-line)' }}
          required
        />
        <button
          type="submit"
          disabled={carregando}
          className="rounded-sm px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-ink)' }}
        >
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {erro && (
        <div className="mt-6">
          {erro.categoria === 'saldo_insuficiente' ? (
            <Aviso tipo="erro" titulo="Saldo insuficiente" acao={{ rotulo: 'Ir para o Dashboard', onClick: () => (window.location.href = '/') }}>
              Recarregue seu saldo para continuar buscando.
            </Aviso>
          ) : (
            <Aviso tipo="erro" titulo={erro.message} />
          )}
        </div>
      )}

      {resultado && (
        <div className="mt-8">
          {resultado.aviso && (
            <div className="mb-4">
              <Aviso tipo="info" titulo="Sobre este resultado">
                {resultado.aviso}
              </Aviso>
            </div>
          )}

          {resultado.resultados.length === 0 ? (
            <EmptyState
              titulo="Nenhum resultado encontrado"
              descricao={`Nenhum processo encontrado para "${termo}" nos tribunais pesquisados (${resultado.tribunais_pesquisados.join(', ')}).`}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {resultado.resultados.map((r, i) => (
                <li
                  key={i}
                  className="rounded-sm border p-4"
                  style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper-card)' }}
                >
                  <div className="flex items-center justify-between">
                    <StampBadge numeroCnj={r.processo.numero_cnj} />
                    <span
                      className="rounded-sm px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: r.confianca_match === 'exata' ? 'var(--color-forest-soft)' : 'var(--color-brass-soft)',
                        color: r.confianca_match === 'exata' ? 'var(--color-forest)' : 'var(--color-ink)',
                      }}
                    >
                      {r.confianca_match === 'exata' ? 'Match exato' : 'Match provável'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium">{r.processo.classe ?? 'Classe não informada'}</p>
                  <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
                    {r.processo.tribunal} · {r.processo.orgao_julgador ?? 'órgão não informado'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
