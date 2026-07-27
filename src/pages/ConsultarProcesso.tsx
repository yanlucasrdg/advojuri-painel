import { useState } from 'react'
import { consultarProcesso } from '../lib/endpoints'
import { ApiError } from '../lib/api'
import { Aviso } from '../components/Aviso'
import { StampBadge } from '../components/StampBadge'
import { TRIBUNAIS, type Processo } from '../types'

export function ConsultarProcesso() {
  const [numeroCnj, setNumeroCnj] = useState('')
  const [tribunal, setTribunal] = useState<string>(TRIBUNAIS[0])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<ApiError | null>(null)
  const [processo, setProcesso] = useState<Processo | null>(null)

  async function consultar(e: React.FormEvent) {
    e.preventDefault()
    if (!numeroCnj.trim()) return

    setCarregando(true)
    setErro(null)
    setProcesso(null)
    try {
      const resultado = await consultarProcesso(numeroCnj, tribunal)
      setProcesso(resultado)
    } catch (err) {
      setErro(err instanceof ApiError ? err : new ApiError('servidor', 'Erro inesperado.'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold">Consultar processo</h2>

      <form onSubmit={consultar} className="mt-6 flex gap-2">
        <input
          type="text"
          value={numeroCnj}
          onChange={(e) => setNumeroCnj(e.target.value)}
          placeholder="5005023-96.2023.4.03.6309"
          className="flex-1 rounded-sm border px-3 py-2 font-mono text-sm"
          style={{ borderColor: 'var(--color-line)' }}
          required
        />
        <select
          value={tribunal}
          onChange={(e) => setTribunal(e.target.value)}
          className="rounded-sm border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--color-line)' }}
        >
          {TRIBUNAIS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="outro">Outro</option>
        </select>
        <button
          type="submit"
          disabled={carregando}
          className="rounded-sm px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-ink)' }}
        >
          {carregando ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {erro && (
        <div className="mt-6">
          {erro.categoria === 'nao_encontrado' ? (
            <Aviso tipo="info" titulo="Processo não encontrado">
              Verifique o número CNJ e o tribunal selecionado.
            </Aviso>
          ) : erro.categoria === 'saldo_insuficiente' ? (
            <Aviso tipo="erro" titulo="Saldo insuficiente" acao={{ rotulo: 'Ir para o Dashboard', onClick: () => (window.location.href = '/') }}>
              Recarregue seu saldo para continuar consultando.
            </Aviso>
          ) : (
            <Aviso tipo="erro" titulo={erro.message} />
          )}
        </div>
      )}

      {processo && (
        <div className="mt-8">
          <div className="flex items-start justify-between">
            <StampBadge numeroCnj={processo.numero_cnj} />
            {processo.segredo_justica && (
              <span
                className="rounded-sm px-2 py-1 text-xs font-medium"
                style={{ backgroundColor: 'var(--color-brick-soft)', color: 'var(--color-brick)' }}
              >
                Segredo de justiça
              </span>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt style={{ color: 'var(--color-ink-soft)' }}>Classe</dt>
              <dd className="font-medium">{processo.classe ?? '—'}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-ink-soft)' }}>Tribunal</dt>
              <dd className="font-medium">{processo.tribunal}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-ink-soft)' }}>Órgão julgador</dt>
              <dd className="font-medium">{processo.orgao_julgador ?? '—'}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-ink-soft)' }}>Valor da ação</dt>
              <dd className="font-mono font-medium">
                {processo.valor_acao != null ? `R$ ${processo.valor_acao.toLocaleString('pt-BR')}` : '—'}
              </dd>
            </div>
            <div className="col-span-2">
              <dt style={{ color: 'var(--color-ink-soft)' }}>Assunto</dt>
              <dd className="font-medium">{processo.assunto ?? '—'}</dd>
            </div>
          </dl>

          {processo.partes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-ink-soft)' }}>
                Partes
              </h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {processo.partes.map((p, i) => (
                  <li key={i}>
                    <span className="font-medium">{p.nome}</span>
                    {p.polo && <span style={{ color: 'var(--color-ink-soft)' }}> · polo {p.polo}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {processo.movimentos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-ink-soft)' }}>
                Movimentações
              </h3>
              <ol className="mt-3 flex flex-col gap-4 border-l-2 pl-4" style={{ borderColor: 'var(--color-brass-soft)' }}>
                {[...processo.movimentos]
                  .sort((a, b) => new Date(b.data_movimento).getTime() - new Date(a.data_movimento).getTime())
                  .map((m, i) => (
                    <li key={i} className="relative">
                      <span
                        className="absolute -left-[21px] top-1 h-2 w-2 rounded-full"
                        style={{ backgroundColor: 'var(--color-brass)' }}
                      />
                      <p className="font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                        {new Date(m.data_movimento).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm">{m.descricao}</p>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
