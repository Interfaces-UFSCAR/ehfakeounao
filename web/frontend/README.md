# #ÉFakeOuNão? — Frontend

Interface web onde os usuários se cadastram e votam se cada tweet é verdadeiro, falso ou irrelevante.

## Stack

- **Next.js 15** (pages router) + **React 18**
- **TypeScript**
- **Tailwind CSS 3**
- **shadcn/ui** (Radix UI) + **lucide-react** para componentes e ícones

## Pré-requisitos

- [Bun](https://bun.sh/) (ou Node.js 20)
- O backend rodando (veja [`../backend/README.md`](../backend/README.md))

## Configuração

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL do backend (padrão: `http://localhost:3001`) |

## Rodando

```bash
bun install
bun dev
```

Acesse `http://localhost:3000`.

Outros scripts:

```bash
bun run build   # build de produção
bun run lint    # ESLint
```

Com `STATIC_EXPORT=1` o build gera um site estático na pasta `out/` (é o que o Docker usa).

## Dados locais

Com o banco local vazio, a página de tweets não mostra nada. Para ver tweets, gere dados mock seguindo a seção "Dados locais" do [`../backend/README.md`](../backend/README.md#dados-locais).
