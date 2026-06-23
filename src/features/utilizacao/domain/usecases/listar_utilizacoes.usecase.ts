import { UtilizacaoCompletaDTO } from '../entity/utilizacao.entity'
import { IUtilizacaoRepository } from '../repository/utilizacao.interface.repository'
import { IAutomovelRepository } from '../../../automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../motorista/domain/repository/motorista.interface.repository'

interface ListarUtilizacoesInput {
  apenasAbertas?: boolean
}

export class ListarUtilizacoesUseCase {
  constructor(
    private readonly repositorioUtilizacao: IUtilizacaoRepository,
    private readonly repositorioAutomovel: IAutomovelRepository,
    private readonly repositorioMotorista: IMotoristaRepository
  ) {}

  async executar(input?: ListarUtilizacoesInput): Promise<UtilizacaoCompletaDTO[]> {
    const utilizacoes = await this.repositorioUtilizacao.listar(input)

    const resultado: UtilizacaoCompletaDTO[] = []

    for (const u of utilizacoes) {
      const automovel = await this.repositorioAutomovel.obterPorId(u.automovelId)
      const motorista = await this.repositorioMotorista.obterPorId(u.motoristaId)

      resultado.push({
        id: u.id,
        dataInicio: u.dataInicio,
        dataTermino: u.dataTermino,
        motivo: u.motivo,
        motorista: { id: motorista!.id, nome: motorista!.nome },
        automovel: { id: automovel!.id, placa: automovel!.placa, cor: automovel!.cor, marca: automovel!.marca },
      })
    }

    return resultado
  }
}
