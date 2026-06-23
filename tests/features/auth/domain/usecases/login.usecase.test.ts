import { LoginUseCase } from '../../../../../src/features/auth/domain/usecases/login.usecase'
import { IAuthRepository } from '../../../../../src/features/auth/domain/repository/auth.interface.repository'
import { ErroNaoAutorizado } from '../../../../../src/shared/erros/erro_aplicacao'
import * as jwtServico from '../../../../../src/shared/servicos/jwt_servico'

const USUARIO_VALIDO = process.env.AUTH_USER!
const SENHA_VALIDA = process.env.AUTH_PASSWORD!

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
      repositorioMock.buscarPorUsuario.mockResolvedValue({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })

      const resultado = await useCase.executar({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })

      expect(jwtServico.gerarToken).toHaveBeenCalledWith({ usuario: USUARIO_VALIDO })
      expect(resultado).toEqual({ token: 'token-mockado', usuario: USUARIO_VALIDO })
    })

    it('deve lancar ErroNaoAutorizado quando usuario nao existe', async () => {
      repositorioMock.buscarPorUsuario.mockResolvedValue(null)

      const promise = useCase.executar({ usuario: 'inexistente', senha: SENHA_VALIDA })

      await expect(promise).rejects.toThrow(ErroNaoAutorizado)
      await expect(promise).rejects.toThrow('Usuário ou senha inválidos')
    })

    it('deve lancar ErroNaoAutorizado quando senha nao confere', async () => {
      repositorioMock.buscarPorUsuario.mockResolvedValue({ usuario: USUARIO_VALIDO, senha: SENHA_VALIDA })

      const promise = useCase.executar({ usuario: USUARIO_VALIDO, senha: 'senha_errada' })

      await expect(promise).rejects.toThrow(ErroNaoAutorizado)
      await expect(promise).rejects.toThrow('Usuário ou senha inválidos')
    })
  })
})
