import { Usuario } from '../../domain/entity/usuario.entity'

export interface IAuthDataSource {
  buscarPorUsuario(usuario: string): Usuario | null
}
