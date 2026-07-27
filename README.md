# lavrio-web

Aplicação web do **Lavrio**, construída com **Next.js**, **React**, **PostgreSQL via Docker Compose**, **Jest** e
**Prettier**.

Este documento explica como instalar, configurar e executar o ambiente completo.

---

## 📌 Requisitos

Versões utilizadas:

| Ferramenta     | Versão                   |
|----------------|--------------------------|
| Docker         | 29.1.2                   |
| Docker Compose | 1.29.2                   |
| Node           | 20.19.6                  |
| NVM            | instalado                |
| PostgreSQL     | 18.1-alpine (via Docker) |

Requisitos mínimos:

- Node 18+
- Docker + Docker Compose
- NVM (opcional)

---

# 1. Instalação e Setup

## 1.1 Clonar o repositório

```bash
git clone https://github.com/Jean8791/lavrio-web.git
cd lavrio-web
```

## 1.2 Instalar dependências

```bash
npm install
```

## 1.3 Selecionar a versão correta do Node

```bash
nvm use v20.19.6
```

## Se necessário:

```bash
nvm install v20.19.6
nvm use v20.19.6
```

---

# 2. Banco de Dados (Docker Compose)

### Subir banco

```bash
 docker compose -f infra/docker-compose.yaml up
```

### Em background

```bash
docker compose -f infra/docker-compose.yaml up -d
```

### Derrubar e apagar banco

```bash
docker compose -f infra/docker-compose.yaml down
```

### Status

```bash
docker compose -f infra/docker-compose.yaml ps
```

### Todos os containers

```bash
docker ps --all
```

### docker-compose.yaml

```yaml
services:
  database:
    container_name: 'postgres-dev'
    image: 'postgres:18.1-alpine3.23'
    env_file:
      - ../.env.development
    ports:
      - '5432:5432'
```

---

# 3. Conectar ao PostgreSQL via DBeaver

Crie uma nova conexão PostgreSQL com:

| Campo    | Valor          |
|----------|----------------|
| Host     | localhost      |
| Port     | 5432           |
| Database | lavrio_db      |
| Username | lavrio_user    |
| Password | local_password |

---

# 4. Rodar a Aplicação Next.js

```bash
npm run dev
```

Acessar:

```
http://localhost:3000
```

---

# 5. Scripts Disponíveis

| Script       | Descrição                    |
|--------------|-------------------------------|
| `dev`        | Sobe o banco, aguarda o Postgres, roda as migrations e inicia o Next.js |
| `test`       | Executa testes Jest          |
| `test:watch` | Testes em modo observador    |
| `lint:check` | Verifica formatação Prettier |
| `lint:fix`   | Corrige formatação           |

---

# 6. Testes

```bash
npm test
```

## Modo observador:

```bash
npm run test:watch
```

---

# 7. Lint / Formatação

## Verificar:

```bash
npm run lint:check
```

## Corrigir:

```bash
npm run lint:fix
```

---

# 8. Estrutura Sugerida do Projeto

```
📦root/
├──📂pages/
│ └──📄index.js
├──📂models/
│ ├──📄users.js
│ ├──📄content.js
│ └──📄password.js
├──📂infra/
│ ├──📄database.js
│ ├──📂migrations/
│ ├──📂scripts/
│ │ └──📄wait-for-postgres.js
│ └──📂provisioning/
│ ├──📂staging/
│ └──📂production/
└──📂tests/
```

---

# 9. Licença

MIT.