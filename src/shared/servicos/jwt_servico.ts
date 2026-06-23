import jwt from 'jsonwebtoken'

const SEGREDO = 'segredo-super-seguro-teste-seidor-2026'
const EXPIRACAO = '1h'

interface PayloadToken {
  usuario: string
}

export function gerarToken(payload: PayloadToken): string {
  return jwt.sign(payload, SEGREDO, { expiresIn: EXPIRACAO })
}

export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, SEGREDO) as PayloadToken
}
