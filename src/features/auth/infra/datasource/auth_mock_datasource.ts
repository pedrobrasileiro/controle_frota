import { Usuario } from '../../domain/entity/usuario.entity'
import { IAuthDataSource } from './iauth_datasource'

export class AuthMockDataSource implements IAuthDataSource {
  private readonly usuarios: Usuario[] = [
    { usuario: 'admin', senha: 'admin123' },
  ]

  buscarPorUsuario(usuario: string): Usuario | null {
    return this.usuarios.find((u) => u.usuario === usuario) ?? null
  }
}
