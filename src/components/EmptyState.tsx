interface EmptyStateProps {
  titulo: string
  descricao: string
  acao?: { rotulo: string; onClick: () => void }
}

export function EmptyState({ titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div
      className="rounded-sm border border-dashed p-10 text-center"
      style={{ borderColor: 'var(--color-line)' }}
    >
      <p className="font-display text-lg">{titulo}</p>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
        {descricao}
      </p>
      {acao && (
        <button
          onClick={acao.onClick}
          className="mt-4 rounded-sm px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--color-ink)' }}
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  )
}
