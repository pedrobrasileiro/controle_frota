import request from 'supertest'
import { criarApp } from '../../src/app'

describe('Health - GET /api/health', () => {
  const app = criarApp()

  it('deve retornar 200 com status ok', async () => {
    const resposta = await request(app).get('/api/health')

    expect(resposta.status).toBe(200)
    expect(resposta.body).toHaveProperty('status', 'ok')
    expect(resposta.body).toHaveProperty('timestamp')
    expect(new Date(resposta.body.timestamp).toISOString()).toBe(resposta.body.timestamp)
  })

  it('deve ser acessivel sem autenticacao', async () => {
    const resposta = await request(app).get('/api/health')

    expect(resposta.status).toBe(200)
  })
})
