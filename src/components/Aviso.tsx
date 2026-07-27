import type { ReactNode } from 'react'

interface AvisoProps {
  tipo: 'erro' | 'info' | 'sucesso'
  titulo: string
  children?: ReactNode
  acao?: { rotulo: string; onClick: () => void }
}

const ESTILOS = {
  erro: { bg: 'var(--color-brick-soft)', borda: 'var(--color-brick)', texto: 'var(--color-brick)' },
  info: { bg: 'var(--color-paper-card)', borda: 'var(--color-brass)', texto: 'var(--color-ink)' },
  sucesso: { bg: 'var(--color-forest-soft)', borda: 'var(--color-forest)', texto: 'var(--color-forest)' },
}

export function Aviso({ tipo, titulo, children, acao }: AvisoProps) {
  const estilo = ESTILOS[tipo]
  return (
    <div
      className="rounded-sm border-l-4 p-4"
      style={{ backgroundColor: estilo.bg, borderColor: estilo.borda }}
    >
      <p className="font-medium" style={{ color: estilo.texto }}>
        {titulo}
      </p>
      {children && <div className="mt-1 text-sm" style={{ color: 'var(--color-ink-soft)' }}>{children}</div>}
      {acao && (
        <button
          onClick={acao.onClick}
          className="mt-3 text-sm font-medium underline underline-offset-2"
          style={{ color: estilo.texto }}
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  )
}
