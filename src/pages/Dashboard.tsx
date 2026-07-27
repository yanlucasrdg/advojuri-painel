import { useEffect, useState } from 'react'
import { obterSaldo, recarregarSaldo } from '../lib/endpoints'
import { ApiError } from '../lib/api'
import { Aviso } from '../components/Aviso'

export function Dashboard() {
  const [saldoReais, setSaldoReais] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [valorRecarga, setValorRecarga] = useState('50')
  const [recarregando, setRecarregando] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const resultado = await obterSaldo()
      setSaldoReais(resultado.saldo_reais)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro inesperado ao carregar saldo.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function confirmarRecarga(e: React.FormEvent) {
    e.preventDefault()
    const valorNumerico = Number.parseFloat(valorRecarga.replace(',', '.'))
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) return

    setRecarregando(true)
    try {
      await recarregarSaldo(Math.round(valorNumerico * 100))
      setModalAberto(false)
      await carregar()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro inesperado ao recarregar.')
    } finally {
      setRecarregando(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold">Dashboard</h2>

      <div className="mt-6">
        {erro && <Aviso tipo="erro" titulo={erro} acao={{ rotulo: 'Tentar de novo', onClick: carregar }} />}

        {!erro && (
          <div
            className="rounded-sm border p-8"
            style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper-card)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
              Saldo atual
            </p>
            <p className="mt-1 font-mono text-4xl font-medium">
              {carregando ? '...' : `R$ ${saldoReais?.toFixed(2).replace('.', ',')}`}
            </p>

            <button
              onClick={() => setModalAberto(true)}
              className="mt-6 rounded-sm px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-brass)' }}
            >
              Recarregar saldo
            </button>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-ink-soft)' }}>
              Ambiente de demonstração — sem gateway de pagamento real conectado ainda.
            </p>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-6">
          <div
            className="w-full max-w-sm rounded-sm border p-6"
            style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper)' }}
          >
            <h3 className="font-display text-lg font-semibold">Recarregar saldo</h3>
            <form onSubmit={confirmarRecarga} className="mt-4 flex flex-col gap-3">
              <label className="text-sm font-medium">
                Valor (R$)
                <input
                  type="text"
                  inputMode="decimal"
                  value={valorRecarga}
                  onChange={(e) => setValorRecarga(e.target.value)}
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  style={{ borderColor: 'var(--color-line)' }}
                  required
                />
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 rounded-sm border py-2 text-sm font-medium"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={recarregando}
                  className="flex-1 rounded-sm py-2 text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                >
                  {recarregando ? 'Processando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
