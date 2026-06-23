import request from 'supertest'
import { criarApp } from '../../src/app'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!

describe('Utilizacoes - /api/utilizacoes', () => {
  let app: ReturnType<typeof criarApp>
  let token: string
  let automovelId: string
  let motoristaId: string
  let utilizacaoId: string

  beforeAll(async () => {
    app = criarApp()
    const login = await request(app)
      .post('/api/auth')
      .send({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })
    token = login.body.token

    const auto = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'AAA-1111', cor: 'Azul', marca: 'Fiat' })
    automovelId = auto.body.id

    const mot = await request(app)
      .post('/api/motoristas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Carlos' })
    motoristaId = mot.body.id
  })

  it('deve iniciar utilizacao e retornar 201 com DTO completo', async () => {
    const resposta = await request(app)
      .post('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        automovelId,
        motoristaId,
        motivo: 'Viagem de negócios',
      })

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBeDefined()
    expect(resposta.body.motivo).toBe('Viagem de negócios')
    expect(resposta.body.dataTermino).toBeNull()
    expect(resposta.body.motorista).toEqual({ id: motoristaId, nome: 'Carlos' })
    expect(resposta.body.automovel).toEqual({ id: automovelId, placa: 'AAA-1111', cor: 'Azul', marca: 'Fiat' })
    utilizacaoId = resposta.body.id
  })

  it('deve retornar 400 ao criar utilizacao sem motivo', async () => {
    const resposta = await request(app)
      .post('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({ automovelId, motoristaId })

    expect(resposta.status).toBe(400)
  })

  it('deve retornar 404 ao usar automovel inexistente', async () => {
    const resposta = await request(app)
      .post('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        automovelId: 'id-inexistente',
        motoristaId,
        motivo: 'Teste',
      })

    expect(resposta.status).toBe(404)
  })

  it('deve retornar 409 ao tentar usar automovel ja em uso', async () => {
    const resposta = await request(app)
      .post('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        automovelId,
        motoristaId,
        motivo: 'Tentativa conflito',
      })

    expect(resposta.status).toBe(409)
  })

  it('deve retornar 409 ao tentar usar mesmo motorista em outro automovel', async () => {
    const segundoAuto = await request(app)
      .post('/api/automoveis')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'BBB-2222', cor: 'Vermelho', marca: 'Toyota' })

    const resposta = await request(app)
      .post('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        automovelId: segundoAuto.body.id,
        motoristaId,
        motivo: 'Motorista ocupado',
      })

    expect(resposta.status).toBe(409)
  })

  it('deve listar utilizacoes e retornar 200 com DTO contendo dados aninhados', async () => {
    const resposta = await request(app)
      .get('/api/utilizacoes')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body.length).toBeGreaterThanOrEqual(1)

    const u = resposta.body[0]
    expect(u.id).toBeDefined()
    expect(u.dataInicio).toBeDefined()
    expect(u.motivo).toBeDefined()
    expect(u.motorista).toBeDefined()
    expect(u.motorista.id).toBeDefined()
    expect(u.motorista.nome).toBeDefined()
    expect(u.automovel).toBeDefined()
    expect(u.automovel.id).toBeDefined()
    expect(u.automovel.placa).toBeDefined()
    expect(u.automovel.cor).toBeDefined()
    expect(u.automovel.marca).toBeDefined()
  })

  it('deve finalizar utilizacao e retornar 200', async () => {
    const resposta = await request(app)
      .put(`/api/utilizacoes/${utilizacaoId}/finalizar`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(200)
    expect(resposta.body.dataTermino).not.toBeNull()
  })

  it('deve retornar 409 ao tentar finalizar utilizacao ja finalizada', async () => {
    const resposta = await request(app)
      .put(`/api/utilizacoes/${utilizacaoId}/finalizar`)
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(409)
  })

  it('deve retornar 404 ao finalizar utilizacao inexistente', async () => {
    const resposta = await request(app)
      .put('/api/utilizacoes/id-inexistente/finalizar')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(404)
  })
})
