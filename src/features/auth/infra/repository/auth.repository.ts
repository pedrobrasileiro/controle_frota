import { Usuario } from '../../domain/entity/usuario.entity'
import { IAuthRepository } from '../../domain/repository/auth.interface.repository'
import { IAuthDataSource } from '../datasource/iauth_datasource'

export class AuthRepository implements IAuthRepository {
  constructor(private readonly datasource: IAuthDataSource) {}

  async buscarPorUsuario(usuario: string): Promise<Usuario | null> {
    return this.datasource.buscarPorUsuario(usuario)
  }
}
