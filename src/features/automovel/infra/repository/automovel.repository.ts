import { Automovel } from '../../domain/entity/automovel.entity'
import { IAutomovelRepository } from '../../domain/repository/automovel.interface.repository'
import { IAutomovelDataSource } from '../datasource/iautomovel_datasource'

export class AutomovelRepository implements IAutomovelRepository {
  constructor(private readonly datasource: IAutomovelDataSource) {}

  async salvar(automovel: Automovel): Promise<Automovel> {
    return this.datasource.salvar(automovel)
  }

  async atualizar(automovel: Automovel): Promise<Automovel> {
    return this.datasource.atualizar(automovel)
  }

  async excluir(id: string): Promise<void> {
    this.datasource.excluir(id)
  }

  async obterPorId(id: string): Promise<Automovel | null> {
    return this.datasource.obterPorId(id)
  }

  async obterPorPlaca(placa: string): Promise<Automovel | null> {
    return this.datasource.obterPorPlaca(placa)
  }

  async listar(filtros?: { cor?: string; marca?: string }): Promise<Automovel[]> {
    return this.datasource.listar(filtros)
  }
}
