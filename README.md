# matriz-pratica-web

Aplicação web do **Matriz Prática**, construída com **Next.js**, **React**, **PostgreSQL via Docker Compose**, **Jest** e
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
git clone https://github.com/Jean8791/matriz-pratica-web.git
cd matriz-pratica-web
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

| Campo    | Valor               |
| -------- | ------------------- |
| Host     | localhost           |
| Port     | 5432                |
| Database | matriz_pratica_db   |
| Username | matriz_pratica_user |
| Password | local_password      |

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
| `release:staging`    | Promove `development` → `master` (stage) |
| `release:production` | Promove `master` → `release` (produção) e cria a tag de versão |

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

O projeto usa 3 branches fixas, que **nunca mudam de nome** (não há mais uma branch nova por versão):

| Branch        | Papel                                         | Aponta para produção via |
| ------------- | ---------------------------------------------- | ------------------------- |
| `release`     | Produção                                       | Production Branch da Vercel |
| `master`      | Stage, para testar antes de liberar            | —                          |
| `development` | Onde o dia a dia do desenvolvimento acontece   | —                          |

A versão do projeto fica só no campo `version` do `package.json` (precisa ser um semver válido — por isso `0.0.X` e não `0.0X`) e é exposta em `GET /api/v1/status`. Cada versão promovida para produção ganha também uma tag git no formato `vX.Y.Z` (ex: `v0.0.4`), criada no momento do `release:production`. É essa tag — não mais o nome da branch — que identifica qual versão está em produção, o que permite rollback sem precisar trocar a Production Branch na Vercel.

## Fluxo

```
development (código novo)
     │  npm run release:staging
     ▼
master (testa em stage por um tempo)
     │  npm run release:production
     ▼
release (produção, com tag vX.Y.Z)
```

## 1. Promover development → master (stage)

Rode a partir de qualquer branch, com a árvore de trabalho limpa (sem alterações pendentes) **e com o Node correto ativo (`nvm use`)**:

```bash
npm run release:staging
```

O script (`infra/scripts/promote-to-master.js`) faz automaticamente:

1. Lê a versão atual de `master` e de `development` (direto do `package.json` de cada branch) e garante que a da `development` é maior.
2. Faz checkout de `master` e merge de `development` (`--no-edit`).
3. Incrementa a versão da `development` em `+1` no último número e commita (`chore: bump version to 0.0.X`).
4. Dá `push` de `master` e `development` para o `origin`.

Se o merge gerar conflito, o script para e mostra as instruções na tela: resolva o conflito, `git add`, `git commit` e rode `npm run release:staging` de novo — o script detecta que o merge já foi concluído e só termina o bump de versão da `development`.

## 2. Promover master → release (produção)

Depois de validar a versão em stage, rode:

```bash
npm run release:production
```

O script (`infra/scripts/promote-to-release.js`) faz automaticamente:

1. Lê a versão atual de `master` e garante que ainda não existe uma tag `vX.Y.Z` correspondente.
2. Faz checkout de `release` e merge de `master` (`--no-edit`).
3. Cria a tag `vX.Y.Z` apontando para o commit de release.
4. Dá `push` de `release` e da tag para o `origin`.

Se o merge gerar conflito, o mesmo princípio se aplica: resolva manualmente, `git commit` e rode `npm run release:production` de novo.

Para reverter uma versão em produção, use "Promote to Production" no deployment anterior direto no dashboard da Vercel, ou reverta a tag anterior manualmente com git.

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
