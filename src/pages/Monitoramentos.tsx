import { useEffect, useState } from 'react'
import { cancelarMonitoramento, criarMonitoramento, listarMonitoramentos } from '../lib/endpoints'
import { ApiError } from '../lib/api'
import { Aviso } from '../components/Aviso'
import { EmptyState } from '../components/EmptyState'
import { SegredoUmaVez } from '../components/SegredoUmaVez'
import { TRIBUNAIS, type Monitoramento } from '../types'

export function Monitoramentos() {
  const [lista, setLista] = useState<Monitoramento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [formAberto, setFormAberto] = useState(false)
  const [numeroCnj, setNumeroCnj] = useState('')
  const [tribunal, setTribunal] = useState<string>(TRIBUNAIS[0])
  const [webhookUrl, setWebhookUrl] = useState('')
  const [criando, setCriando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [segredoNovo, setSegredoNovo] = useState<string | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const resultado = await listarMonitoramentos()
      setLista(resultado)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro inesperado ao carregar monitoramentos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    setErroForm(null)
    setCriando(true)
    try {
      const resultado = await criarMonitoramento(numeroCnj.trim(), tribunal, webhookUrl.trim())
      setSegredoNovo(resultado.webhook_secret)
    } catch (err) {
      setErroForm(err instanceof ApiError ? err.message : 'Erro inesperado ao criar monitoramento.')
    } finally {
      setCriando(false)
    }
  }

  function finalizarCriacao() {
    setSegredoNovo(null)
    setFormAberto(false)
    setNumeroCnj('')
    setWebhookUrl('')
    carregar()
  }

  async function cancelar(id: string) {
    try {
      await cancelarMonitoramento(id)
      await carregar()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro inesperado ao cancelar.')
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Monitoramentos</h2>
        {!formAberto && (
          <button
            onClick={() => setFormAberto(true)}
            className="rounded-sm px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-ink)' }}
          >
            Novo monitoramento
          </button>
        )}
      </div>

      {formAberto && (
        <div
          className="mt-6 rounded-sm border p-6"
          style={{ borderColor: 'var(--color-brass)', backgroundColor: 'var(--color-paper-card)' }}
        >
          {segredoNovo ? (
            <SegredoUmaVez
              titulo="Monitoramento criado"
              descricao="Use este segredo para validar a assinatura HMAC (header X-AdvoJuri-Signature) dos webhooks recebidos."
              valor={segredoNovo}
              rotuloBotaoContinuar="Concluir"
              onContinuar={finalizarCriacao}
            />
          ) : (
            <form onSubmit={criar} className="flex flex-col gap-3">
              {erroForm && <Aviso tipo="erro" titulo={erroForm} />}
              <label className="text-sm font-medium">
                Número CNJ
                <input
                  type="text"
                  value={numeroCnj}
                  onChange={(e) => setNumeroCnj(e.target.value)}
                  placeholder="5005023-96.2023.4.03.6309"
                  className="mt-1 w-full rounded-sm border px-3 py-2 font-mono text-sm"
                  style={{ borderColor: 'var(--color-line)' }}
                  required
                />
                <span className="mt-1 block text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                  O processo precisa já ter sido consultado antes (aba "Consultar processo").
                </span>
              </label>
              <label className="text-sm font-medium">
                Tribunal
                <select
                  value={tribunal}
                  onChange={(e) => setTribunal(e.target.value)}
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  {TRIBUNAIS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                URL do webhook (HTTPS)
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://seusite.com.br/webhooks/advojuri"
                  className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                  style={{ borderColor: 'var(--color-line)' }}
                  required
                />
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormAberto(false)}
                  className="flex-1 rounded-sm border py-2 text-sm font-medium"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={criando}
                  className="flex-1 rounded-sm py-2 text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-brass)' }}
                >
                  {criando ? 'Criando...' : 'Criar monitoramento'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="mt-6">
        {erro && <Aviso tipo="erro" titulo={erro} acao={{ rotulo: 'Tentar de novo', onClick: carregar }} />}

        {!erro && !carregando && lista.length === 0 && (
          <EmptyState
            titulo="Nenhum monitoramento ainda"
            descricao="Adicione um processo para acompanhar novas movimentações automaticamente."
            acao={{ rotulo: 'Novo monitoramento', onClick: () => setFormAberto(true) }}
          />
        )}

        {!erro && lista.length > 0 && (
          <ul className="flex flex-col gap-3">
            {lista.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-sm border p-4"
                style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper-card)' }}
              >
                <div>
                  <p className="text-sm font-medium">{m.webhook_url}</p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                    {m.ultima_verificacao_em
                      ? `Última verificação: ${new Date(m.ultima_verificacao_em).toLocaleString('pt-BR')}`
                      : 'Ainda não verificado'}
                    {' · '}
                    {m.ativo ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                {m.ativo && (
                  <button
                    onClick={() => cancelar(m.id)}
                    className="text-sm font-medium underline underline-offset-2"
                    style={{ color: 'var(--color-brick)' }}
                  >
                    Cancelar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
