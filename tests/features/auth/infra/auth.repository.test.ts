import { AuthRepository } from '../../../../src/features/auth/infra/repository/auth.repository'
import { IAuthDataSource } from '../../../../src/features/auth/infra/datasource/iauth_datasource'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!

describe('AuthRepository', () => {
  let datasourceMock: jest.Mocked<IAuthDataSource>
  let repositorio: AuthRepository

  beforeEach(() => {
    datasourceMock = {
      buscarPorUsuario: jest.fn(),
    }
    repositorio = new AuthRepository(datasourceMock)
  })

  describe('buscarPorUsuario', () => {
    it('deve delegar ao datasource e retornar usuario quando encontrado', async () => {
      const usuarioMock = { usuario: USUARIO_VALIDO, senha: SENHA_VALIDA }
      datasourceMock.buscarPorUsuario.mockReturnValue(usuarioMock)

      const resultado = await repositorio.buscarPorUsuario(USUARIO_VALIDO)

      expect(datasourceMock.buscarPorUsuario).toHaveBeenCalledWith(USUARIO_VALIDO)
      expect(resultado).toEqual(usuarioMock)
    })

    it('deve delegar ao datasource e retornar null quando nao encontrado', async () => {
      datasourceMock.buscarPorUsuario.mockReturnValue(null)

      const resultado = await repositorio.buscarPorUsuario('inexistente')

      expect(datasourceMock.buscarPorUsuario).toHaveBeenCalledWith('inexistente')
      expect(resultado).toBeNull()
    })
  })
})
