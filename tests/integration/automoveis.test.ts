import request from 'supertest'
import { criarApp } from '../../src/app'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!
const PLACA_UNICA = `ABC-${Date.now()}`

describe('Automoveis - CRUD /api/automoveis', () => {
  let app: ReturnType<typeof criarApp>
  let token: string
  let automovelId: string

  beforeAll(async () => {
    app = criarApp()
    const login = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })
    token = login.body.token
  })

  it('deve criar automovel e retornar 201', async () => {
    const resposta = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: PLACA_UNICA, cor: 'Preto', marca: 'Ford' })

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBeDefined()
    expect(resposta.body.placa).toBe(PLACA_UNICA)
    expect(resposta.body.cor).toBe('Preto')
    expect(resposta.body.marca).toBe('Ford')
    automovelId = resposta.body.id
  })

  it('deve retornar 409 ao cadastrar automovel com placa duplicada', async () => {
    const resposta = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: PLACA_UNICA, cor: 'Branco', marca: 'Fiat' })

    expect(resposta.status).toBe(409)
    expect(resposta.body.mensagem).toBe('Já existe um automóvel cadastrado com esta placa')
  })

  it('deve retornar 400 ao criar sem campos obrigatorios', async () => {
    const resposta = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'ABC-1234' })

    expect(resposta.status).toBe(400)
  })

  it('deve listar automoveis e retornar 200', async () => {
    const resposta = await request(app)
      .get('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)
  })

  it('deve filtrar automoveis por cor e retornar 200', async () => {
    await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'FILTRO-COR-1', cor: 'Vermelho', marca: 'Fiat' })

    const resposta = await request(app)
      .get('/api/automoveis?cor=Vermelho')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)
    expect(resposta.body.every((a: any) => a.cor === 'Vermelho')).toBe(true)
  })

  it('deve filtrar automoveis por marca e retornar 200', async () => {
    await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'FILTRO-MARCA-1', cor: 'Azul', marca: 'Honda' })

    const resposta = await request(app)
      .get('/api/automoveis?marca=Honda')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)
    expect(resposta.body.every((a: any) => a.marca === 'Honda')).toBe(true)
  })

  it('deve obter automovel por id e retornar 200', async () => {
    const resposta = await request(app)
      .get(`/api/automoveis/${automovelId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(resposta.body.id).toBe(automovelId)
    expect(resposta.body.placa).toBe(PLACA_UNICA)
  })

  it('deve retornar 404 ao obter automovel inexistente', async () => {
    const resposta = await request(app)
      .get('/api/automoveis/id-inexistente')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(404)
  })

  it('deve atualizar automovel e retornar 200', async () => {
    const resposta = await request(app)
      .put(`/api/automoveis/${automovelId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'XYZ-9999', cor: 'Branco' })

    expect(resposta.status).toBe(200)
    expect(resposta.body.placa).toBe('XYZ-9999')
    expect(resposta.body.cor).toBe('Branco')
    expect(resposta.body.marca).toBe('Ford')
  })

  it('deve excluir automovel e retornar 204', async () => {
    const resposta = await request(app)
      .delete(`/api/automoveis/${automovelId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(204)
  })
})
