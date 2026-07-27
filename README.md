# AdvoJuri — Painel

Cliente React (Vite + TypeScript + Tailwind v4) que consome a API AdvoJuri
(`advojuri-api`) via HTTP. Não usa Supabase diretamente — é um cliente puro,
toda a persistência vive no backend.

## Setup local

```bash
cp .env.example .env
# VITE_API_BASE_URL aponta pro backend. Localhost por padrão.

npm install
npm run dev
```

## Testes e build

```bash
npm run test    # 12 testes: helpers de sessão + categorização de erro de API
npm run build   # tsc -b && vite build — falha se houver erro de tipo
```

## Autenticação

Sem senha. O fluxo é: criar conta (`POST /v1/auth/signup`) ou colar uma API
key existente. A chave fica em `sessionStorage` (expira ao fechar a aba —
trade-off deliberado de segurança pro MVP, ver `src/lib/auth.ts`).

## Design

Paleta "papel + tinta oficial": fundo cinza-frio, tinta azul-marinho, acento
latão. Elemento de assinatura visual: números de processo CNJ sempre em
formato de "carimbo de cartório" (`src/components/StampBadge.tsx`) — borda
dupla, leve rotação, monoespaçada com algarismos tabulares. Tokens em
`src/index.css` (`@theme`).

## O que NÃO está aqui ainda

1. **Backend não deployado.** `VITE_API_BASE_URL` aponta pra `localhost:8000`
   por padrão. Sem o backend rodando (local ou deployado), toda chamada
   retorna erro de rede — é esperado, a UI trata isso com uma mensagem clara
   em vez de travar, mas nada funciona de ponta a ponta até o backend subir
   em algum lugar acessível.
2. **CORS do backend está liberado só para localhost.** Quando o painel for
   deployado (Vercel/Netlify), o domínio de produção precisa entrar em
   `ALLOWED_ORIGINS` no `.env` do backend, senão o navegador bloqueia as
   chamadas mesmo com tudo certo do lado do painel.
3. **Sem confirmação de e-mail no signup.** Qualquer um pode criar tenants em
   loop — aceitável pra fase de demo/pitch, não pra produção pública (mesma
   ressalva já documentada no backend).
4. **Sem paginação** em `/v1/monitoramentos` nem na lista de resultados de
   busca — ok pro volume esperado de um MVP, vira problema com centenas de
   monitoramentos por tenant.
5. **`window.location.href` em vez de navegação client-side** nos CTAs de
   "saldo insuficiente" (ConsultarProcesso.tsx, Buscar.tsx) — funciona, mas
   força reload completo da página. Trocar por `useNavigate()` do
   react-router é uma limpeza pequena e não urgente.
6. **Sem loading skeleton**, só texto "Carregando...". Suficiente pro MVP,
   mas é o tipo de polish que vale a pena antes de mostrar pra um cliente
   externo.

## Deploy

Qualquer host de site estático funciona (Vercel, Netlify, Cloudflare Pages).
Build gera `dist/`. Lembrar de setar `VITE_API_BASE_URL` nas env vars do
host apontando pro backend real, e adicionar o domínio final em
`ALLOWED_ORIGINS` no backend.
