import { Request, Response, NextFunction } from 'express'
import { ErroValidacao } from '../erros/erro_aplicacao'

export function validarCamposObrigatorios(...campos: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const campo of campos) {
      if (req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === '') {
        throw new ErroValidacao(`O campo "${campo}" é obrigatório`)
      }
    }
    next()
  }
}
