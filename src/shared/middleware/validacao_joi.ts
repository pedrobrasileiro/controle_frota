import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ErroValidacao } from '../erros/erro_aplicacao'

export function validarSchema(schema: Joi.ObjectSchema, tipo: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[tipo], { abortEarly: false, stripUnknown: true })
    if (error) {
      const mensagem = error.details.map((d) => d.message).join('; ')
      throw new ErroValidacao(mensagem)
    }
    req[tipo] = value
    next()
  }
}
