# #ÉFakeOuNão? — Web

Aplicação web do projeto, dividida em:

- [`backend/`](backend/README.md): API em Express + MongoDB
- [`frontend/`](frontend/README.md): interface em Next.js

Os READMEs de cada pasta explicam como rodar sem Docker. Abaixo, como subir tudo junto com Docker.

## Rodando com Docker

O `docker-compose.yaml` sobe quatro serviços:

| Serviço | Descrição | Porta |
|---|---|---|
| `frontend` | build estático do Next.js servido por nginx | `3000` |
| `backend` | API Express | `3001` |
| `mongo` | MongoDB 7 (dados no volume `mongo-data`) | interna |
| `seed` | popula o MongoDB com dados de teste e encerra | — |

### Pré-requisitos

- Docker com Docker Compose v2

### Passo a passo

1. Configure o backend:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Preencha pelo menos `JWT_SECRET` (qualquer string); sem ele, cadastro e login dão erro. `EMAIL` e as `GMAIL_*` são opcionais e só servem para enviar e-mails (veja [Variáveis de e-mail](backend/README.md#variáveis-de-e-mail)). O `MONGO_URI` não precisa ser alterado: o compose já aponta para o container `mongo`.

2. Suba os containers:

   ```bash
   docker compose up --build -d
   ```

3. Acesse:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001/health`

### Dados

O banco é populado automaticamente: a cada `docker compose up`, o serviço `seed` espera o MongoDB ficar pronto, roda o script [`scripts/seed.js`](scripts/seed.js) e encerra. Ele cria:

- um usuário de teste com e-mail já confirmado (login `teste@example.com`, senha `teste123`), então não é preciso configurar o envio de e-mail;
- 10 tweets falsos com `label: "unverified"`, seguindo o schema do tweet (veja a seção "Dados locais" do [`backend/README.md`](backend/README.md#dados-locais)).

O que já existe não é duplicado, então rodar várias vezes não tem problema. Para ver o resultado: `docker compose logs seed`. Para recomeçar do zero: `docker compose down -v`.

Outras opções estão em [Rodando sem envio de e-mail](backend/README.md#rodando-sem-envio-de-e-mail).

### Comandos úteis

```bash
docker compose logs -f backend   # logs do backend
docker compose down              # para os containers
docker compose down -v           # para e apaga os dados do MongoDB
```

A URL da API (`NEXT_PUBLIC_API_URL`) é embutida no frontend durante o build. Se mudar, rode `docker compose up --build` de novo.
