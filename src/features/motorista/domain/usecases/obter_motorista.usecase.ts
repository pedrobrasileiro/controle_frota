import { Motorista } from '../entity/motorista.entity'
import { IMotoristaRepository } from '../repository/motorista.interface.repository'
import { ErroNaoEncontrado } from '../../../../shared/erros/erro_aplicacao'

export class ObterMotoristaUseCase {
  constructor(private readonly repositorio: IMotoristaRepository) {}

  async executar(id: string): Promise<Motorista> {
    const motorista = await this.repositorio.obterPorId(id)
    if (!motorista) {
      throw new ErroNaoEncontrado('Motorista não encontrado')
    }
    return motorista
  }
}
