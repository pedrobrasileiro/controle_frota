import request from 'supertest'
import { criarApp } from '../../src/app'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!

describe('Motoristas - CRUD /api/motoristas', () => {
  let app: ReturnType<typeof criarApp>
  let token: string
  let motoristaId: string

  beforeAll(async () => {
    app = criarApp()
    const login = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })
    token = login.body.token
  })

  it('deve criar motorista e retornar 201', async () => {
    const resposta = await request(app)
      .post('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'João Silva' })

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBeDefined()
    expect(resposta.body.nome).toBe('João Silva')
    motoristaId = resposta.body.id
  })

  it('deve retornar 409 ao cadastrar motorista com nome duplicado', async () => {
    const resposta = await request(app)
      .post('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'João Silva' })

    expect(resposta.status).toBe(409)
    expect(resposta.body.mensagem).toBe('Já existe um motorista cadastrado com este nome')
  })

  it('deve retornar 400 ao criar sem nome', async () => {
    const resposta = await request(app)
      .post('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(resposta.status).toBe(400)
  })

  it('deve listar motoristas e retornar 200', async () => {
    const resposta = await request(app)
      .get('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)
  })

  it('deve filtrar motoristas por nome e retornar 200', async () => {
    await request(app)
      .post('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Ana Oliveira' })

    const resposta = await request(app)
      .get('/api/motoristas?nome=Ana')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)
    expect(resposta.body.every((m: any) => m.nome.toLowerCase().includes('ana'))).toBe(true)
  })

  it('deve obter motorista por id e retornar 200', async () => {
    const resposta = await request(app)
      .get(`/api/motoristas/${motoristaId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(resposta.body.id).toBe(motoristaId)
    expect(resposta.body.nome).toBe('João Silva')
  })

  it('deve retornar 404 ao obter motorista inexistente', async () => {
    const resposta = await request(app)
      .get('/api/motoristas/id-inexistente')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(404)
  })

  it('deve atualizar motorista e retornar 200', async () => {
    const resposta = await request(app)
      .put(`/api/motoristas/${motoristaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Maria Souza' })

    expect(resposta.status).toBe(200)
    expect(resposta.body.nome).toBe('Maria Souza')
  })

  it('deve excluir motorista e retornar 204', async () => {
    const resposta = await request(app)
      .delete(`/api/motoristas/${motoristaId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(204)
  })
})
