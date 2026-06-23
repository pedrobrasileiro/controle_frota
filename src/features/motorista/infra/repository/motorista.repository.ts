import { Motorista } from '../../domain/entity/motorista.entity'
import { IMotoristaRepository } from '../../domain/repository/motorista.interface.repository'
import { IMotoristaDataSource } from '../datasource/imotorista_datasource'

export class MotoristaRepository implements IMotoristaRepository {
  constructor(private readonly datasource: IMotoristaDataSource) {}

  async salvar(motorista: Motorista): Promise<Motorista> {
    return this.datasource.salvar(motorista)
  }

  async atualizar(motorista: Motorista): Promise<Motorista> {
    return this.datasource.atualizar(motorista)
  }

  async excluir(id: string): Promise<void> {
    this.datasource.excluir(id)
  }

  async obterPorId(id: string): Promise<Motorista | null> {
    return this.datasource.obterPorId(id)
  }

  async obterPorNome(nome: string): Promise<Motorista | null> {
    return this.datasource.obterPorNome(nome)
  }

  async listar(filtros?: { nome?: string }): Promise<Motorista[]> {
    return this.datasource.listar(filtros)
  }
}
