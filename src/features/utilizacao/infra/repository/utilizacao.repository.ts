import { Utilizacao } from '../../domain/entity/utilizacao.entity'
import { IUtilizacaoRepository } from '../../domain/repository/utilizacao.interface.repository'
import { IUtilizacaoDataSource } from '../datasource/iutilizacao_datasource'

export class UtilizacaoRepository implements IUtilizacaoRepository {
  constructor(private readonly datasource: IUtilizacaoDataSource) {}

  async salvar(utilizacao: Utilizacao): Promise<Utilizacao> {
    return this.datasource.salvar(utilizacao)
  }

  async atualizar(utilizacao: Utilizacao): Promise<Utilizacao> {
    return this.datasource.atualizar(utilizacao)
  }

  async obterPorId(id: string): Promise<Utilizacao | null> {
    return this.datasource.obterPorId(id)
  }

  async listar(): Promise<Utilizacao[]> {
    return this.datasource.listar()
  }

  async obterUtilizacaoAtivaPorAutomovel(automovelId: string): Promise<Utilizacao | null> {
    const utilizacoes = this.datasource.obterPorAutomovelId(automovelId)
    return utilizacoes.find((u) => u.dataTermino === null) ?? null
  }

  async obterUtilizacaoAtivaPorMotorista(motoristaId: string): Promise<Utilizacao | null> {
    const utilizacoes = this.datasource.obterPorMotoristaId(motoristaId)
    return utilizacoes.find((u) => u.dataTermino === null) ?? null
  }
}
