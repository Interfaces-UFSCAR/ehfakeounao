# #ÉFakeOuNão? — Backend

API onde os usuários se cadastram e votam se cada tweet é verdadeiro, falso ou irrelevante.

## Stack

- **Node.js 20 / Bun**: runtime
- **Express 4**: servidor HTTP
- **MongoDB + Mongoose 6**: banco de dados e modelos
- **JWT (`jsonwebtoken`) + `bcryptjs`**: autenticação e hash de senha
- **Gmail API + Nodemailer + Handlebars**: e-mails de confirmação de conta e de recuperação de senha

## Pré-requisitos

- [Bun](https://bun.sh/) (ou Node.js 20)
- Um MongoDB rodando. O jeito mais simples é com Docker:

```bash
docker run -d --name ehfake-mongo -p 27017:27017 mongo:7
```

## Configuração

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `MONGO_URI` | sim | URL de conexão do MongoDB (padrão: `mongodb://localhost:27017/ehfakeounao`) |
| `JWT_SECRET` | sim | Segredo usado para assinar os tokens de login (qualquer string). Sem ele, cadastro e login retornam erro 500 |
| `FRONTEND_URL` | não | URL do frontend, usada nos links dos e-mails (padrão: `http://localhost:3000`) |
| `EMAIL` | não | Conta Gmail que envia os e-mails |
| `GMAIL_CLIENT_ID` | não | Client ID do cliente OAuth no Google Cloud |
| `GMAIL_CLIENT_SECRET` | não | Client secret desse cliente OAuth |
| `GMAIL_REFRESH_TOKEN` | não | Refresh token gerado no OAuth Playground |

### Variáveis de e-mail

A API envia dois tipos de e-mail:

- **Confirmação de conta**: enviado no cadastro, com um link `FRONTEND_URL/confirm-email?token=...`. O login só funciona depois que o usuário abre esse link.
- **Recuperação de senha**: enviado quando o usuário pede para redefinir a senha, com um link `FRONTEND_URL/reset-password?token=...&id=...`.

Os e-mails saem da conta do `EMAIL` pela API do Gmail (HTTPS, porta 443, timeout de 10 s), e não por SMTP: o plano gratuito do Render bloqueia as portas de SMTP. O Nodemailer só monta a mensagem.

Configuração (uma vez, logado com a conta do `EMAIL`):

1. No [Google Cloud Console](https://console.cloud.google.com/), crie um projeto e ative a **Gmail API**.
2. Em **Google Auth Platform → Público-alvo**, escolha **Externo** e adicione o `EMAIL` como usuário de teste. Em **Acesso a dados**, adicione o escopo `https://www.googleapis.com/auth/gmail.send`.
3. **Publique o app** ("Em produção"). Em "Teste", o refresh token expira em 7 dias e os e-mails param de sair sem aviso.
4. Em **Clientes**, crie um cliente OAuth do tipo **Aplicativo da Web** com o URI de redirecionamento `https://developers.google.com/oauthplayground`. Guarde o client ID e o client secret.
5. No [OAuth Playground](https://developers.google.com/oauthplayground): engrenagem → marque **Use your own OAuth credentials** e cole o client ID e o secret; no passo 1, informe o escopo `https://www.googleapis.com/auth/gmail.send` → **Authorize APIs** (entre com a conta do `EMAIL`); no passo 2, **Exchange authorization code for tokens** e copie o **refresh token**.
6. Preencha `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` e `GMAIL_REFRESH_TOKEN`.

Se essas variáveis estiverem vazias ou erradas, a API continua funcionando: o erro de envio só aparece no log (com a resposta do Google) e o e-mail não chega. Se o log mostrar `invalid_grant`, o refresh token foi revogado ou expirou: repita o passo 5. Para testar sem e-mail, veja [Rodando sem envio de e-mail](#rodando-sem-envio-de-e-mail).

## Rodando

```bash
bun install
bun start
```

A API sobe em `http://localhost:3001`. Para conferir: `curl http://localhost:3001/health`.

## Rotas

- `/auth`: cadastro, login, confirmação de e-mail e recuperação de senha
- `/users`: dados do usuário
- `/tweets`: listagem de tweets e votos
- `/health`: verificação de saúde

## Dados locais

O MongoDB local começa **vazio**. Nada neste repositório importa tweets para o banco (não existe rota para criar tweet), então a lista de tweets fica vazia até você inserir dados mock seguindo o schema definido em `src/models/tweetModel.js`:

| Campo | Tipo | Observação |
|---|---|---|
| `tweet_id` | string | obrigatório e único (id do tweet no Twitter) |
| `text` | string | obrigatório |
| `label` | `"true"`, `"fake"`, `"unverified"` ou `"irrelevant"` | padrão `"unverified"` |
| `votes` | lista de `{ user: ObjectId, vote: "true" \| "fake" \| "irrelevant" }` | comece com `[]` |
| `tags` | lista de string | opcional |

Exemplo com `mongosh` (banco `ehfakeounao`, coleção `tweets`):

```bash
mongosh ehfakeounao
```

```js
db.tweets.insertMany([
  { tweet_id: "1", text: "Tweet de exemplo 1", label: "unverified", votes: [], tags: [] },
  { tweet_id: "2", text: "Tweet de exemplo 2", label: "unverified", votes: [], tags: [] }
])
```

Se o Mongo estiver no container do comando acima, use `docker exec -it ehfake-mongo mongosh ehfakeounao`.

Também existe um script pronto que cria tweets mock e 4 usuários já verificados (login `teste@example.com`, senha `teste123`):

```bash
bun src/scripts/seed.js
```

## Rodando sem envio de e-mail

Para testar localmente não é preciso configurar o Gmail. Basta ter um usuário com `verified: true` no banco. Algumas formas, da mais simples para a mais manual:

**1. Inserir um usuário de teste já verificado** (no `mongosh ehfakeounao`):

```js
db.users.insertOne({
  fullName: "Usuário Teste",
  email: "teste@example.com",
  password: "$2a$10$k6YksC38MMrJ33lScgRE1utCeEKBN58ncwigmWOiEsi.4bGCtLS6W",
  verified: true,
  votedTweets: []
})
```

O campo `password` guarda o hash bcrypt da senha `teste123`. Depois é só entrar com `teste@example.com` / `teste123`.

**2. Rodar o seed** (`bun src/scripts/seed.js`): cria esse mesmo usuário, mais outros 3 e tweets mock.

**3. Cadastrar pela tela e confirmar manualmente**: depois do cadastro, o backend imprime no log o link de confirmação (`http://localhost:3000/confirm-email?token=...`). Abra esse link no navegador, ou marque o usuário como verificado direto no banco:

```js
db.users.updateOne({ email: "seu@email.com" }, { $set: { verified: true } })
```

A recuperação de senha depende do e-mail, então não funciona sem ele.
