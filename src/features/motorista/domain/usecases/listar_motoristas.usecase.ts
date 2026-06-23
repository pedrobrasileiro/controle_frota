import { Motorista } from '../entity/motorista.entity'
import { IMotoristaRepository } from '../repository/motorista.interface.repository'

interface ListarMotoristasInput {
  nome?: string
}

export class ListarMotoristasUseCase {
  constructor(private readonly repositorio: IMotoristaRepository) {}

  async executar(input?: ListarMotoristasInput): Promise<Motorista[]> {
    return this.repositorio.listar(input)
  }
}
