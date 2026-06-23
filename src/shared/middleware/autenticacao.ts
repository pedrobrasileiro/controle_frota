import { Request, Response, NextFunction } from 'express'
import { verificarToken } from '../servicos/jwt_servico'
import { ErroNaoAutenticado } from '../erros/erro_aplicacao'

export function middlewareAutenticacao(req: Request, _res: Response, next: NextFunction): void {
  const cabecalho = req.headers.authorization

  if (!cabecalho) {
    throw new ErroNaoAutenticado('Token de autenticação não fornecido')
  }

  const partes = cabecalho.split(' ')

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    throw new ErroNaoAutenticado('Formato do token inválido. Use: Bearer <token>')
  }

  try {
    const payload = verificarToken(partes[1])
    ;(req as any).usuario = payload.usuario
    next()
  } catch {
    throw new ErroNaoAutenticado('Token inválido ou expirado')
  }
}
