import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { limparApiKey } from '../lib/auth'

const ITENS_NAV = [
  { rota: '/', rotulo: 'Dashboard' },
  { rota: '/consultar', rotulo: 'Consultar processo' },
  // '/buscar' removido do menu — funcionalidade desativada no backend
  // (DataJud não expõe nome de parte). A rota ainda existe e mostra uma
  // explicação, pra quem chegar por link direto ou favorito antigo.
  { rota: '/monitoramentos', rotulo: 'Monitoramentos' },
]

export function Layout() {
  const navigate = useNavigate()

  function sair() {
    limparApiKey()
    navigate('/entrar', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <aside
        className="flex w-60 shrink-0 flex-col justify-between p-6"
        style={{ backgroundColor: 'var(--color-ink)' }}
      >
        <div>
          <h1 className="font-display text-xl font-semibold text-white">AdvoJuri</h1>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-brass-soft)' }}>
            Consulta processual
          </p>

          <nav className="mt-10 flex flex-col gap-1">
            {ITENS_NAV.map((item) => (
              <NavLink
                key={item.rota}
                to={item.rota}
                end={item.rota === '/'}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-2 text-sm transition-colors ${
                    isActive ? 'font-medium text-white' : 'text-white/60 hover:text-white/90'
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(156, 122, 60, 0.25)' : 'transparent',
                })}
              >
                {item.rotulo}
              </NavLink>
            ))}
          </nav>
        </div>

        <button onClick={sair} className="text-left text-sm text-white/50 hover:text-white/80">
          Sair
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
