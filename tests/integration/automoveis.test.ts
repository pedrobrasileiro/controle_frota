import request from 'supertest'
import { criarApp } from '../../src/app'

describe('Automoveis - CRUD /api/automoveis', () => {
  let app: ReturnType<typeof criarApp>
  let token: string
  let automovelId: string

  beforeAll(async () => {
    app = criarApp()
    const login = await request(app)
      .post('/api/auth')
      .send({ usuario: 'admin', senha: 'admin123' })
    token = login.body.token
  })

  it('deve criar automovel e retornar 201', async () => {
    const resposta = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'ABC-1234', cor: 'Preto', marca: 'Ford' })

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBeDefined()
    expect(resposta.body.placa).toBe('ABC-1234')
    expect(resposta.body.cor).toBe('Preto')
    expect(resposta.body.marca).toBe('Ford')
    automovelId = resposta.body.id
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

  it('deve obter automovel por id e retornar 200', async () => {
    const resposta = await request(app)
      .get(`/api/automoveis/${automovelId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(resposta.body.id).toBe(automovelId)
    expect(resposta.body.placa).toBe('ABC-1234')
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
