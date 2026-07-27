import { useState } from 'react'

interface SegredoUmaVezProps {
  titulo: string
  descricao: string
  valor: string
  rotuloBotaoContinuar: string
  onContinuar: () => void
}

/**
 * Padrão "copie agora, não vai aparecer de novo" — usado tanto pra API key
 * (signup) quanto pro webhook_secret (criação de monitoramento). Só libera
 * o botão de continuar depois que o usuário confirma explicitamente que
 * copiou, porque perder esse valor significa ter que gerar um novo.
 */
export function SegredoUmaVez({
  titulo,
  descricao,
  valor,
  rotuloBotaoContinuar,
  onContinuar,
}: SegredoUmaVezProps) {
  const [copiado, setCopiado] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado(true)
    } catch {
      // clipboard API pode falhar (permissão, contexto não-seguro) —
      // o valor continua selecionável manualmente no <code>, não é fatal.
    }
  }

  return (
    <div
      className="rounded-sm border p-6"
      style={{ borderColor: 'var(--color-brass)', backgroundColor: 'var(--color-paper-card)' }}
    >
      <h3 className="font-display text-lg font-semibold">{titulo}</h3>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
        {descricao}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <code
          className="flex-1 overflow-x-auto rounded-sm border px-3 py-2 font-mono text-sm"
          style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-paper)' }}
        >
          {valor}
        </code>
        <button
          onClick={copiar}
          className="shrink-0 rounded-sm border px-3 py-2 text-sm font-medium"
          style={{ borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
        >
          {copiado ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(e) => setConfirmado(e.target.checked)}
          className="mt-1"
        />
        <span>Copiei e guardei este valor em local seguro. Sei que ele não vai aparecer de novo.</span>
      </label>

      <button
        onClick={onContinuar}
        disabled={!confirmado}
        className="mt-4 w-full rounded-sm py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: 'var(--color-ink)' }}
      >
        {rotuloBotaoContinuar}
      </button>
    </div>
  )
}
