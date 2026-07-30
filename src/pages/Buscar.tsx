import { Aviso } from '../components/Aviso'

/**
 * Busca por CNPJ/nome foi desativada no backend (GET /v1/busca retorna 501).
 * Motivo: confirmado empiricamente que a API Pública do DataJud não expõe
 * nome de parte em nenhum processo — não é bug de query, é ausência
 * estrutural do campo na fonte de dados (ver README do backend).
 *
 * Mantém esta página (em vez de simplesmente remover a rota) pra dar uma
 * explicação clara a quem chegar aqui por link direto ou favorito antigo,
 * em vez de uma tela em branco ou 404 confuso.
 */
export function Buscar() {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold">Buscar por nome/CNPJ</h2>

      <div className="mt-6">
        <Aviso tipo="info" titulo="Funcionalidade temporariamente indisponível">
          A API Pública do DataJud não expõe nome de parte em nenhum processo —
          confirmado em produção, não é uma limitação de implementação nossa que
          será corrigida em breve. Buscar por CNPJ ou nome exigiria integrar uma
          fonte de dados adicional, o que ainda não foi feito.
          <br />
          <br />
          Use a{' '}
          <a href="/consultar" className="underline underline-offset-2">
            Consulta por número CNJ
          </a>
          , que funciona normalmente.
        </Aviso>
      </div>
    </div>
  )
}
