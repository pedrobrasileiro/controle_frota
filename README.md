# Controle de Frotas — API

Sistema web para controlar a utilização dos automóveis de uma empresa.
Permite cadastrar automóveis e motoristas, gerenciar utilizações e garantir que não haja conflitos de uso.

[Documentação Swagger](http://localhost:3000/api/docs/) — UI interativa com todos os endpoints.

## Stack

| Tecnologia   | Versão         |
| ------------ | -------------- |
| Node.js      | 22.13.0 (asdf) |
| TypeScript   | 5+             |
| Express.js   | 4              |
| Jest         | 29             |
| ts-node-dev  | 2              |
| jsonwebtoken | 9              |

## Pré-requisitos

- [asdf](https://asdf-vm.com) com plugin `nodejs`

```bash
asdf plugin add nodejs
asdf install
```

## Setup

```bash
npm install
```

## Configuração

Copie o arquivo de ambiente e ajuste se necessário:

```bash
cp .env.example .env
```

| Variável         | Padrão                            | Descrição          |
| ---------------- | --------------------------------- | ------------------ |
| `AUTH_USER`      | `admin`                           | Login              |
| `AUTH_PASSWORD`  | `admin123`                        | Senha              |
| `JWT_SECRET`     | `segredo-super-seguro-teste-2026` | Chave HMAC do JWT  |
| `JWT_EXPIRATION` | `1h`                              | Expiração do token |
| `PORTA`          | `3000`                            | Porta HTTP         |

## Executar

```bash
# Desenvolvimento (com hot reload via ts-node-dev)
npm run dev

# Build
npm run build

# Produção
npm start
```

A API roda em `http://localhost:3000`.

## Testes

```bash
# Todos os testes (unitários + integração)
npm test

# Apenas unitários
npm run test:unit

# Apenas integração (supertest)
npm run test:integration

# Cobertura
npm run test:coverage
```

**123 testes, 27 suites, 0 falhas.**

## Autenticação

Todos os endpoints exigem token JWT, exceto `POST /api/auth` e `GET /api/docs/`.

As credenciais são lidas do arquivo `.env` (variáveis `AUTH_USER` e `AUTH_PASSWORD`).

```bash
# Obter token
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"usuario":"AUTH_USER","senha":"AUTH_PASSWORD"}'

# Usar token nas requisições
curl http://localhost:3000/api/automoveis \
  -H "Authorization: Bearer <token>"
```

## Endpoints

| Método   | Rota                             | Descrição                            |
| -------- | -------------------------------- | ------------------------------------ |
| `POST`   | `/api/auth`                      | Autenticar (AUTH_USER/AUTH_PASSWORD) |
| `POST`   | `/api/automoveis`                | Criar automóvel                      |
| `GET`    | `/api/automoveis`                | Listar (filtros: `?cor=&marca=`)     |
| `GET`    | `/api/automoveis/:id`            | Obter por ID                         |
| `PUT`    | `/api/automoveis/:id`            | Atualizar                            |
| `DELETE` | `/api/automoveis/:id`            | Excluir                              |
| `POST`   | `/api/motoristas`                | Criar motorista                      |
| `GET`    | `/api/motoristas`                | Listar (filtro: `?nome=`)            |
| `GET`    | `/api/motoristas/:id`            | Obter por ID                         |
| `PUT`    | `/api/motoristas/:id`            | Atualizar                            |
| `DELETE` | `/api/motoristas/:id`            | Excluir                              |
| `POST`   | `/api/utilizacoes`               | Iniciar utilização                   |
| `GET`    | `/api/utilizacoes`               | Listar utilizações                   |
| `PUT`    | `/api/utilizacoes/:id/finalizar` | Finalizar utilização                 |

## Regras de Negócio

- Automóvel/motorista não podem ser excluídos se tiverem utilização ativa.
- Um automóvel só pode ser usado por um motorista por vez.
- Um motorista não pode usar dois automóveis simultaneamente.
- Não é permitido cadastrar dois automóveis com a mesma placa.
- Não é permitido cadastrar dois motoristas com o mesmo nome.

## Estrutura do Projeto

```
src/
├── app.ts                          # Factory do Express
├── main.ts                         # Entrypoint (app.listen, dotenv)
├── composicao/composicao_rotas.ts  # Injeção de dependência manual
├── features/
│   ├── automovel/                  # CRUD automóveis
│   ├── motorista/                  # CRUD motoristas
│   ├── utilizacao/                 # Gerenciamento de utilizações
│   ├── auth/                       # Autenticação JWT
│   └── docs/                       # Swagger UI (/api/docs)
├── shared/
│   ├── erros/                      # Classes de erro padronizadas
│   ├── middleware/                  # Auth, validação, error handler
│   └── servicos/                   # JWT
tests/
├── features/                       # Testes unitários
├── integration/                    # Testes de integração (supertest)
└── setup.ts                        # Carrega .env.test antes dos testes
docs/
├── swagger.yaml                    # Especificação OpenAPI 3.0
└── controle-frotas.postman_collection.json  # Collection Postman
.env                               # Variáveis de ambiente
.env.test                          # Ambiente de teste (jest)
```

Cada feature segue Clean Architecture com `domain/` (entity, usecases, repository), `infra/` (datasource, repository) e `presentation/` (controller, rotas).

## Documentação da API

### Swagger UI (interativo)

Acesse `http://localhost:3000/api/docs/` com o servidor rodando.

### OpenAPI (YAML)

`docs/swagger.yaml` — especificação OpenAPI 3.0 com todos os 14 endpoints e esquema de autenticação Bearer JWT.

### Postman

`docs/controle-frotas.postman_collection.json` — collection pronta para importar no Postman com todas as rotas, variáveis de ambiente (`{{base_url}}`, `{{token}}`) e exemplos de body.
