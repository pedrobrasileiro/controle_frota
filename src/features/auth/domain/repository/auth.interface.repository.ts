import { Usuario } from '../entity/usuario.entity'

export interface IAuthRepository {
  buscarPorUsuario(usuario: string): Promise<Usuario | null>
}
