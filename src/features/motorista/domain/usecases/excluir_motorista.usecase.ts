import { IMotoristaRepository } from '../repository/motorista.interface.repository'
import { IUtilizacaoRepository } from '../../../utilizacao/domain/repository/utilizacao.interface.repository'
import { ErroNaoEncontrado, ErroConflito } from '../../../../shared/erros/erro_aplicacao'

export class ExcluirMotoristaUseCase {
  constructor(
    private readonly repositorioMotorista: IMotoristaRepository,
    private readonly repositorioUtilizacao: IUtilizacaoRepository
  ) {}

  async executar(id: string): Promise<void> {
    const motorista = await this.repositorioMotorista.obterPorId(id)
    if (!motorista) {
      throw new ErroNaoEncontrado('Motorista não encontrado')
    }

    const utilizacaoAtiva = await this.repositorioUtilizacao.obterUtilizacaoAtivaPorMotorista(id)
    if (utilizacaoAtiva) {
      throw new ErroConflito('Motorista está em uso e não pode ser excluído')
    }

    await this.repositorioMotorista.excluir(id)
  }
}
