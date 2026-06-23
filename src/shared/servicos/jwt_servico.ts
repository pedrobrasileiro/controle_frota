import jwt from 'jsonwebtoken'

const SEGREDO = process.env.JWT_SECRET ?? 'segredo-super-seguro-teste-seidor-2026'
const EXPIRACAO = process.env.JWT_EXPIRATION ?? '1h'

interface PayloadToken {
  usuario: string
}

export function gerarToken(payload: PayloadToken): string {
  return jwt.sign(payload, SEGREDO, { expiresIn: EXPIRACAO } as jwt.SignOptions)
}

export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, SEGREDO) as PayloadToken
}