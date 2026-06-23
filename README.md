# Controle de Frotas — API

Sistema web para controlar a utilização dos automóveis de uma empresa.
Permite cadastrar automóveis e motoristas, gerenciar utilizações e garantir que não haja conflitos de uso.

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

## Executar

```bash
# Desenvolvimento (com hot reload)
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

**118 testes, 27 suites, 0 falhas.**

## Autenticação

Todos os endpoints exigem token JWT, exceto `POST /api/auth`.

```bash
# Obter token
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"usuario":"USER","senha":"PASS"}'

# Usar token nas requisições
curl http://localhost:3000/api/automoveis \
  -H "Authorization: Bearer <token>"
```

## Endpoints

| Método   | Rota                             | Descrição                        |
| -------- | -------------------------------- | -------------------------------- |
| `POST`   | `/api/auth`                      | Autenticar (admin/admin123)      |
| `POST`   | `/api/automoveis`                | Criar automóvel                  |
| `GET`    | `/api/automoveis`                | Listar (filtros: `?cor=&marca=`) |
| `GET`    | `/api/automoveis/:id`            | Obter por ID                     |
| `PUT`    | `/api/automoveis/:id`            | Atualizar                        |
| `DELETE` | `/api/automoveis/:id`            | Excluir                          |
| `POST`   | `/api/motoristas`                | Criar motorista                  |
| `GET`    | `/api/motoristas`                | Listar (filtro: `?nome=`)        |
| `GET`    | `/api/motoristas/:id`            | Obter por ID                     |
| `PUT`    | `/api/motoristas/:id`            | Atualizar                        |
| `DELETE` | `/api/motoristas/:id`            | Excluir                          |
| `POST`   | `/api/utilizacoes`               | Iniciar utilização               |
| `GET`    | `/api/utilizacoes`               | Listar utilizações               |
| `PUT`    | `/api/utilizacoes/:id/finalizar` | Finalizar utilização             |

## Regras de Negócio

- Automóvel/motorista não podem ser excluídos se tiverem utilização ativa.
- Um automóvel só pode ser usado por um motorista por vez.
- Um motorista não pode usar dois automóveis simultaneamente.

## Estrutura do Projeto

```
src/
├── app.ts                          # Factory do Express
├── principal.ts                    # Entrypoint (app.listen)
├── composicao/composicao_rotas.ts  # Injeção de dependência manual
├── features/
│   ├── automovel/                  # CRUD automóveis
│   ├── motorista/                  # CRUD motoristas
│   ├── utilizacao/                 # Gerenciamento de utilizações
│   └── auth/                       # Autenticação JWT
├── shared/
│   ├── erros/                      # Classes de erro padronizadas
│   ├── middleware/                  # Auth, validação, error handler
│   └── servicos/                   # JWT
tests/
├── features/                       # Testes unitários
└── integration/                    # Testes de integração (supertest)
```

Cada feature segue Clean Architecture com `domain/` (entity, usecases, repository), `infra/` (datasource, repository) e `presentation/` (controller, rotas).

## Documentação da API

`docs/swagger.yaml` — especificação OpenAPI 3.0 com todos os 14 endpoints e esquema de autenticação Bearer JWT.
