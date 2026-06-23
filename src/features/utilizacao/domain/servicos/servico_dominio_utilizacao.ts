import { IUtilizacaoRepository } from '../repository/utilizacao.interface.repository'
import { ErroConflito } from '../../../../shared/erros/erro_aplicacao'

export class ServicoDominioUtilizacao {
  constructor(private readonly repositorioUtilizacao: IUtilizacaoRepository) {}

  async validarDisponibilidade(automovelId: string, motoristaId: string): Promise<void> {
    const automovelOcupado = await this.repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel(automovelId)
    if (automovelOcupado) {
      throw new ErroConflito('Automóvel já está em uso no momento')
    }

    const motoristaOcupado = await this.repositorioUtilizacao.obterUtilizacaoAtivaPorMotorista(motoristaId)
    if (motoristaOcupado) {
      throw new ErroConflito('Motorista já está utilizando outro automóvel no momento')
    }
  }
}
