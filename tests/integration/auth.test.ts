import request from 'supertest'
import { criarApp } from '../../src/app'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!

describe('Autenticacao - POST /api/auth', () => {
  const app = criarApp()

  it('deve retornar 200 com token para credenciais validas', async () => {
    const resposta = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })

    expect(resposta.status).toBe(200)
    expect(resposta.body).toHaveProperty('token')
    expect(resposta.body.usuario).toBe(USUARIO_VALIDO)
  })

  it('deve retornar 401 para credenciais invalidas', async () => {
    const resposta = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO, senha: 'senha_errada' })

    expect(resposta.status).toBe(401)
    expect(resposta.body.mensagem).toBe('Usuário ou senha inválidos')
    expect(resposta.body.codigo).toBe(401)
  })

  it('deve retornar 400 quando campos obrigatorios estiverem faltando', async () => {
    const resposta = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO })

    expect(resposta.status).toBe(400)
  })

  it('deve retornar 401 ao acessar rota protegida sem token', async () => {
    const resposta = await request(app).get('/api/automoveis')

    expect(resposta.status).toBe(401)
  })
})
