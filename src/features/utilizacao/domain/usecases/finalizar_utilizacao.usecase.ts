import { UtilizacaoCompletaDTO } from '../entity/utilizacao.entity'
import { IUtilizacaoRepository } from '../repository/utilizacao.interface.repository'
import { IAutomovelRepository } from '../../../automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../motorista/domain/repository/motorista.interface.repository'
import { ErroNaoEncontrado, ErroConflito } from '../../../../shared/erros/erro_aplicacao'

interface FinalizarUtilizacaoInput {
  id: string
  dataTermino?: Date
}

export class FinalizarUtilizacaoUseCase {
  constructor(
    private readonly repositorioUtilizacao: IUtilizacaoRepository,
    private readonly repositorioAutomovel: IAutomovelRepository,
    private readonly repositorioMotorista: IMotoristaRepository
  ) {}

  async executar(input: FinalizarUtilizacaoInput): Promise<UtilizacaoCompletaDTO> {
    const utilizacao = await this.repositorioUtilizacao.obterPorId(input.id)
    if (!utilizacao) {
      throw new ErroNaoEncontrado('Utilização não encontrada')
    }

    if (utilizacao.dataTermino !== null) {
      throw new ErroConflito('Utilização já foi finalizada anteriormente')
    }

    utilizacao.dataTermino = input.dataTermino ?? new Date()

    await this.repositorioUtilizacao.atualizar(utilizacao)

    const automovel = await this.repositorioAutomovel.obterPorId(utilizacao.automovelId)
    const motorista = await this.repositorioMotorista.obterPorId(utilizacao.motoristaId)

    return {
      id: utilizacao.id,
      dataInicio: utilizacao.dataInicio,
      dataTermino: utilizacao.dataTermino,
      motivo: utilizacao.motivo,
      motorista: { id: motorista!.id, nome: motorista!.nome },
      automovel: { id: automovel!.id, placa: automovel!.placa, cor: automovel!.cor, marca: automovel!.marca },
    }
  }
}
