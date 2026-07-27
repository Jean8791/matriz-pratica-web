# lavrio-web

Aplicação web do **Lavrio**, construída com **Next.js**, **React**, **PostgreSQL via Docker Compose**, **Jest** e
**Prettier**.

Este documento explica como instalar, configurar e executar o ambiente completo.

---

## 📌 Requisitos

Versões utilizadas:

| Ferramenta     | Versão                   |
| -------------- | ------------------------ |
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
    container_name: "postgres-dev"
    image: "postgres:18.1-alpine3.23"
    env_file:
      - ../.env.development
    ports:
      - "5432:5432"
```

---

# 3. Conectar ao PostgreSQL via DBeaver

Crie uma nova conexão PostgreSQL com:

| Campo    | Valor          |
| -------- | -------------- |
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

| Script       | Descrição                                                                   |
| ------------ | --------------------------------------------------------------------------- |
| `dev`        | Sobe o banco, aguarda o Postgres, roda as migrations e inicia o Next.js     |
| `test`       | Executa testes Jest                                                         |
| `test:watch` | Testes em modo observador                                                   |
| `lint:check` | Verifica formatação Prettier                                                |
| `lint:fix`   | Corrige formatação                                                          |
| `release`    | Gera uma nova versão, promovendo `development` → `master` → `release-0.0.X` |

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

# 8. Versionamento e Releases

O projeto usa 3 branches fixas, cada uma sempre uma versão à frente da anterior:

| Branch          | Papel                                          | Versão (exemplo) |
| --------------- | ---------------------------------------------- | ---------------- |
| `release-0.0.X` | Produção (uma branch nova por versão liberada) | `0.0.1`          |
| `master`        | Stage, para testar antes de liberar            | `0.0.2`          |
| `development`   | Onde o dia a dia do desenvolvimento acontece   | `0.0.3`          |

A versão de cada branch fica no campo `version` do `package.json` (precisa ser um semver válido — por isso `0.0.X` e não `0.0X`) e é exposta em `GET /api/v1/status`.

## Gerando uma nova versão

Todo o trabalho novo é feito na `development`. Quando quiser liberar essa versão (promover `development` → `master` → uma nova `release-0.0.X`), rode a partir da `development`, com a árvore de trabalho limpa (sem alterações pendentes) **e com o Node correto ativo (`nvm use`)**:

```bash
npm run release
```

O script (`infra/scripts/release.js`) faz automaticamente:

1. Lê a versão atual de `master` e de `development` (direto do `package.json` de cada branch).
2. Cria uma nova branch `release-0.0.X` a partir do estado atual da `master` (ela herda a versão que a `master` tinha).
3. Faz merge da `development` na `master` (a `master` passa a ter o código e a versão que estavam na `development`).
4. Incrementa a versão da `development` em `+1` no último número e commita (`chore: bump version to 0.0.X`).
5. Dá `push` das três branches (`master`, `development` e a nova `release-0.0.X`) para o `origin`.

Exemplo: partindo de `release-0.0.1 / master 0.0.2 / development 0.0.3`, rodar `npm run release` resulta em `release-0.0.2 (nova) / master 0.0.3 / development 0.0.4`.

Se a `master` e a `development` divergirem em código (não só na versão) e o merge gerar conflito, o script para antes de dar `push` — resolva o conflito manualmente e finalize o `push` das branches indicado na mensagem de erro.

---

# 9. Estrutura Sugerida do Projeto

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

# 10. Licença

MIT.
