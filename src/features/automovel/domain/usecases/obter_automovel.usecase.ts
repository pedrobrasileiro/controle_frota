import { Automovel } from '../entity/automovel.entity'
import { IAutomovelRepository } from '../repository/automovel.interface.repository'
import { ErroNaoEncontrado } from '../../../../shared/erros/erro_aplicacao'

export class ObterAutomovelUseCase {
  constructor(private readonly repositorio: IAutomovelRepository) {}

  async executar(id: string): Promise<Automovel> {
    const automovel = await this.repositorio.obterPorId(id)
    if (!automovel) {
      throw new ErroNaoEncontrado('Automóvel não encontrado')
    }
    return automovel
  }
}
