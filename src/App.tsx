import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RotaProtegida } from './components/RotaProtegida'
import { Entrar } from './pages/Entrar'
import { Dashboard } from './pages/Dashboard'
import { ConsultarProcesso } from './pages/ConsultarProcesso'
import { Buscar } from './pages/Buscar'
import { Monitoramentos } from './pages/Monitoramentos'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<Entrar />} />

        <Route element={<RotaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/consultar" element={<ConsultarProcesso />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/monitoramentos" element={<Monitoramentos />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
