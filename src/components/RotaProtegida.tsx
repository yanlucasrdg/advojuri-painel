import { Navigate, Outlet } from 'react-router-dom'
import { estaAutenticado } from '../lib/auth'

export function RotaProtegida() {
  if (!estaAutenticado()) {
    return <Navigate to="/entrar" replace />
  }
  return <Outlet />
}
