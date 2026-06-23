import { IAutomovelRepository } from '../repository/automovel.interface.repository'
import { IUtilizacaoRepository } from '../../../utilizacao/domain/repository/utilizacao.interface.repository'
import { ErroNaoEncontrado, ErroConflito } from '../../../../shared/erros/erro_aplicacao'

export class ExcluirAutomovelUseCase {
  constructor(
    private readonly repositorioAutomovel: IAutomovelRepository,
    private readonly repositorioUtilizacao: IUtilizacaoRepository
  ) {}

  async executar(id: string): Promise<void> {
    const automovel = await this.repositorioAutomovel.obterPorId(id)
    if (!automovel) {
      throw new ErroNaoEncontrado('Automóvel não encontrado')
    }

    const utilizacaoAtiva = await this.repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel(id)
    if (utilizacaoAtiva) {
      throw new ErroConflito('Automóvel está em uso e não pode ser excluído')
    }

    await this.repositorioAutomovel.excluir(id)
  }
}
