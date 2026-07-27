import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../lib/endpoints'
import { salvarApiKey } from '../lib/auth'
import { ApiError } from '../lib/api'
import { SegredoUmaVez } from '../components/SegredoUmaVez'
import { Aviso } from '../components/Aviso'

type Modo = 'entrar' | 'criar_conta'

export function Entrar() {
  const navigate = useNavigate()
  const [modo, setModo] = useState<Modo>('entrar')

  const [chaveDigitada, setChaveDigitada] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [chaveGerada, setChaveGerada] = useState<string | null>(null)

  function entrarComChave(e: React.FormEvent) {
    e.preventDefault()
    const chave = chaveDigitada.trim()
    if (!chave) return
    salvarApiKey(chave)
    navigate('/', { replace: true })
  }

  async function criarConta(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      const resultado = await signup(nome.trim(), email.trim())
      setChaveGerada(resultado.api_key)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Erro inesperado ao criar conta.')
    } finally {
      setCarregando(false)
    }
  }

  function continuarAposSignup() {
    if (!chaveGerada) return
    salvarApiKey(chaveGerada)
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold">AdvoJuri</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
            Consulta processual em todo o Brasil
          </p>
        </div>

        {chaveGerada ? (
          <SegredoUmaVez
            titulo="Sua API key foi criada"
            descricao="Use esta chave pra autenticar todas as chamadas à API. Ela só aparece aqui."
            valor={chaveGerada}
            rotuloBotaoContinuar="Continuar para o painel"
            onContinuar={continuarAposSignup}
          />
        ) : (
          <div
            className="rounded-sm border p-6"
            style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper-card)' }}
          >
            <div className="mb-6 flex gap-1 border-b" style={{ borderColor: 'var(--color-line)' }}>
              <button
                onClick={() => setModo('entrar')}
                className="flex-1 border-b-2 pb-2 text-sm font-medium"
                style={{
                  borderColor: modo === 'entrar' ? 'var(--color-brass)' : 'transparent',
                  color: modo === 'entrar' ? 'var(--color-ink)' : 'var(--color-ink-soft)',
                }}
              >
                Já tenho uma API key
              </button>
              <button
                onClick={() => setModo('criar_conta')}
                className="flex-1 border-b-2 pb-2 text-sm font-medium"
                style={{
                  borderColor: modo === 'criar_conta' ? 'var(--color-brass)' : 'transparent',
                  color: modo === 'criar_conta' ? 'var(--color-ink)' : 'var(--color-ink-soft)',
                }}
              >
                Criar conta
              </button>
            </div>

            {erro && (
              <div className="mb-4">
                <Aviso tipo="erro" titulo={erro} />
              </div>
            )}

            {modo === 'entrar' ? (
              <form onSubmit={entrarComChave} className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                  API key
                  <input
                    type="password"
                    value={chaveDigitada}
                    onChange={(e) => setChaveDigitada(e.target.value)}
                    placeholder="ajr_live_..."
                    className="mt-1 w-full rounded-sm border px-3 py-2 font-mono text-sm"
                    style={{ borderColor: 'var(--color-line)' }}
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 rounded-sm py-2 font-medium text-white"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                >
                  Entrar
                </button>
              </form>
            ) : (
              <form onSubmit={criarConta} className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                  Nome do escritório
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                    style={{ borderColor: 'var(--color-line)' }}
                    required
                  />
                </label>
                <label className="text-sm font-medium">
                  E-mail
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-sm border px-3 py-2 text-sm"
                    style={{ borderColor: 'var(--color-line)' }}
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-2 rounded-sm py-2 font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                >
                  {carregando ? 'Criando...' : 'Criar conta'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
