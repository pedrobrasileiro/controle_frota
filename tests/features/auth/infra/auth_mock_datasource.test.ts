import { AuthMockDataSource } from '../../../../src/features/auth/infra/datasource/auth_mock_datasource'

describe('AuthMockDataSource', () => {
  let datasource: AuthMockDataSource

  beforeEach(() => {
    datasource = new AuthMockDataSource()
  })

  describe('buscarPorUsuario', () => {
    it('deve retornar Usuario quando credenciais sao validas', () => {
      const resultado = datasource.buscarPorUsuario('admin')

      expect(resultado).toEqual({ usuario: 'admin', senha: 'admin123' })
    })

    it('deve retornar null quando usuario nao existe', () => {
      const resultado = datasource.buscarPorUsuario('usuario_inexistente')

      expect(resultado).toBeNull()
    })
  })
})
