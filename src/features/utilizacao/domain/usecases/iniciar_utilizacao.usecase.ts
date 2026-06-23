import { v4 as uuid } from 'uuid'
import { Utilizacao, UtilizacaoCompletaDTO } from '../entity/utilizacao.entity'
import { IUtilizacaoRepository } from '../repository/utilizacao.interface.repository'
import { IAutomovelRepository } from '../../../automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../motorista/domain/repository/motorista.interface.repository'
import { ServicoDominioUtilizacao } from '../servicos/servico_dominio_utilizacao'
import { ErroNaoEncontrado, ErroValidacao } from '../../../../shared/erros/erro_aplicacao'

interface IniciarUtilizacaoInput {
  automovelId: string
  motoristaId: string
  motivo: string
}

export class IniciarUtilizacaoUseCase {
  constructor(
    private readonly repositorioAutomovel: IAutomovelRepository,
    private readonly repositorioMotorista: IMotoristaRepository,
    private readonly repositorioUtilizacao: IUtilizacaoRepository,
    private readonly servicoDominio: ServicoDominioUtilizacao
  ) {}

  async executar(input: IniciarUtilizacaoInput): Promise<UtilizacaoCompletaDTO> {
    if (!input.motivo) {
      throw new ErroValidacao('O campo motivo é obrigatório')
    }

    const automovel = await this.repositorioAutomovel.obterPorId(input.automovelId)
    if (!automovel) {
      throw new ErroNaoEncontrado('Automóvel não encontrado')
    }

    const motorista = await this.repositorioMotorista.obterPorId(input.motoristaId)
    if (!motorista) {
      throw new ErroNaoEncontrado('Motorista não encontrado')
    }

    await this.servicoDominio.validarDisponibilidade(input.automovelId, input.motoristaId)

    const utilizacao: Utilizacao = {
      id: uuid(),
      automovelId: input.automovelId,
      motoristaId: input.motoristaId,
      dataInicio: new Date(),
      dataTermino: null,
      motivo: input.motivo,
      criadoEm: new Date(),
    }

    await this.repositorioUtilizacao.salvar(utilizacao)

    return {
      id: utilizacao.id,
      dataInicio: utilizacao.dataInicio,
      dataTermino: utilizacao.dataTermino,
      motivo: utilizacao.motivo,
      motorista: { id: motorista.id, nome: motorista.nome },
      automovel: { id: automovel.id, placa: automovel.placa, cor: automovel.cor, marca: automovel.marca },
    }
  }
}
