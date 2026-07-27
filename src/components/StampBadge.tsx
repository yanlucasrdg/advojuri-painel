interface StampBadgeProps {
  numeroCnj: string
  className?: string
}

/**
 * Elemento de assinatura visual do painel: todo número de processo CNJ
 * aparece nesse formato de "carimbo de cartório" — borda dupla, leve
 * rotação, algarismos tabulares monoespaçados. É o único risco estético
 * deliberado do design; o resto da interface fica quieto ao redor dele.
 */
export function StampBadge({ numeroCnj, className = '' }: StampBadgeProps) {
  return (
    <span
      className={`inline-block -rotate-1 border-2 border-double px-3 py-1 font-mono text-sm tracking-tight ${className}`}
      style={{ borderColor: 'var(--color-brass)', color: 'var(--color-ink)' }}
    >
      {numeroCnj}
    </span>
  )
}
