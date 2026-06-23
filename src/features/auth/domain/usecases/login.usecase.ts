import { ErroNaoAutorizado } from '../../../../shared/erros/erro_aplicacao'
import { gerarToken } from '../../../../shared/servicos/jwt_servico'
import { IAuthRepository } from '../repository/auth.interface.repository'

interface LoginInput {
  usuario: string
  senha: string
}

interface LoginOutput {
  token: string
  usuario: string
}

export class LoginUseCase {
  constructor(private readonly repositorioAuth: IAuthRepository) {}

  async executar(input: LoginInput): Promise<LoginOutput> {
    const usuario = await this.repositorioAuth.buscarPorUsuario(input.usuario)

    if (!usuario || usuario.senha !== input.senha) {
      throw new ErroNaoAutorizado('Usuário ou senha inválidos')
    }

    const token = gerarToken({ usuario: input.usuario })

    return { token, usuario: input.usuario }
  }
}
