import { LoginUseCase } from '../../../../../src/features/auth/domain/usecases/login.usecase'
import { IAuthRepository } from '../../../../../src/features/auth/domain/repository/auth.interface.repository'
import { ErroNaoAutorizado } from '../../../../../src/shared/erros/erro_aplicacao'
import * as jwtServico from '../../../../../src/shared/servicos/jwt_servico'

describe('LoginUseCase', () => {
  let repositorioMock: jest.Mocked<IAuthRepository>
  let useCase: LoginUseCase

  beforeEach(() => {
    repositorioMock = {
      buscarPorUsuario: jest.fn(),
    }
    useCase = new LoginUseCase(repositorioMock)
  })

  describe('executar', () => {
    it('deve retornar token e usuario quando credenciais sao validas', async () => {
      jest.spyOn(jwtServico, 'gerarToken').mockReturnValue('token-mockado')
      repositorioMock.buscarPorUsuario.mockResolvedValue({ usuario: 'admin', senha: 'admin123' })

      const resultado = await useCase.executar({ usuario: 'admin', senha: 'admin123' })

      expect(jwtServico.gerarToken).toHaveBeenCalledWith({ usuario: 'admin' })
      expect(resultado).toEqual({ token: 'token-mockado', usuario: 'admin' })
    })

    it('deve lancar ErroNaoAutorizado quando usuario nao existe', async () => {
      repositorioMock.buscarPorUsuario.mockResolvedValue(null)

      const promise = useCase.executar({ usuario: 'inexistente', senha: 'admin123' })

      await expect(promise).rejects.toThrow(ErroNaoAutorizado)
      await expect(promise).rejects.toThrow('Usuário ou senha inválidos')
    })

    it('deve lancar ErroNaoAutorizado quando senha nao confere', async () => {
      repositorioMock.buscarPorUsuario.mockResolvedValue({ usuario: 'admin', senha: 'admin123' })

      const promise = useCase.executar({ usuario: 'admin', senha: 'senha_errada' })

      await expect(promise).rejects.toThrow(ErroNaoAutorizado)
      await expect(promise).rejects.toThrow('Usuário ou senha inválidos')
    })
  })
})
