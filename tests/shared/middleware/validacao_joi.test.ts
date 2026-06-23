import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { validarSchema } from '../../../src/shared/middleware/validacao_joi'
import { ErroValidacao } from '../../../src/shared/erros/erro_aplicacao'

describe('validarSchema', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<NextFunction>

  const schema = Joi.object({
    nome: Joi.string().min(2).required(),
    idade: Joi.number().min(0),
  })

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} }
    res = {}
    next = jest.fn()
  })

  it('deve chamar next() quando a validacao passar', () => {
    req.body = { nome: 'João', idade: 25 }

    validarSchema(schema)(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })

  it('deve sanitizar o body removendo campos extras', () => {
    req.body = { nome: 'João', idade: 25, extra: 'remover' }

    validarSchema(schema)(req as Request, res as Response, next)

    expect(req.body).toEqual({ nome: 'João', idade: 25 })
    expect(next).toHaveBeenCalled()
  })

  it('deve lancar ErroValidacao quando campo obrigatorio faltar', () => {
    req.body = { idade: 25 }

    expect(() => validarSchema(schema)(req as Request, res as Response, next)).toThrow(ErroValidacao)
    expect(next).not.toHaveBeenCalled()
  })

  it('deve lancar ErroValidacao com mensagens de todos os erros', () => {
    req.body = { nome: 'A', idade: -1 }

    expect(() => validarSchema(schema)(req as Request, res as Response, next)).toThrow(ErroValidacao)
    expect(next).not.toHaveBeenCalled()
  })

  it('deve aceitar tipo query para validar req.query', () => {
    req.query = { nome: 'Teste' }

    validarSchema(schema, 'query')(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('deve aceitar tipo params para validar req.params', () => {
    const paramSchema = Joi.object({ id: Joi.string().uuid().required() })
    req.params = { id: '550e8400-e29b-41d4-a716-446655440000' }

    validarSchema(paramSchema, 'params')(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('deve lancar ErroValidacao quando params nao for uuid valido', () => {
    const paramSchema = Joi.object({ id: Joi.string().uuid().required() })
    req.params = { id: 'invalido' }

    expect(() => validarSchema(paramSchema, 'params')(req as Request, res as Response, next)).toThrow(ErroValidacao)
    expect(next).not.toHaveBeenCalled()
  })
})
