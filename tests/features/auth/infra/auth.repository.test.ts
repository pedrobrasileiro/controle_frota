import { AuthRepository } from '../../../../src/features/auth/infra/repository/auth.repository'
import { IAuthDataSource } from '../../../../src/features/auth/infra/datasource/iauth_datasource'

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
      const usuarioMock = { usuario: 'admin', senha: 'admin123' }
      datasourceMock.buscarPorUsuario.mockReturnValue(usuarioMock)

      const resultado = await repositorio.buscarPorUsuario('admin')

      expect(datasourceMock.buscarPorUsuario).toHaveBeenCalledWith('admin')
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
