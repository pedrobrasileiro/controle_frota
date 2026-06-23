import { Automovel } from '../entity/automovel.entity'
import { IAutomovelRepository } from '../repository/automovel.interface.repository'

interface ListarAutomoveisInput {
  cor?: string
  marca?: string
}

export class ListarAutomoveisUseCase {
  constructor(private readonly repositorio: IAutomovelRepository) {}

  async executar(input?: ListarAutomoveisInput): Promise<Automovel[]> {
    return this.repositorio.listar(input)
  }
}
