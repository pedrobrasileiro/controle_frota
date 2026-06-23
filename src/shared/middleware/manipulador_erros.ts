import { Request, Response, NextFunction } from 'express'
import { ErroAplicacao } from '../erros/erro_aplicacao'

export function manipuladorErros(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ErroAplicacao) {
    res.status(err.codigo).json({
      mensagem: err.message,
      codigo: err.codigo,
    })
    return
  }

  console.error('Erro não tratado:', err)
  res.status(500).json({
    mensagem: 'Erro interno do servidor',
    codigo: 500,
  })
}
