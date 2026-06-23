import { Motorista } from '../entity/motorista.entity'
import { IMotoristaRepository } from '../repository/motorista.interface.repository'
import { ErroValidacao } from '../../../../shared/erros/erro_aplicacao'

interface ListarMotoristasInput {
  nome?: string
}

export class ListarMotoristasUseCase {
  constructor(private readonly repositorio: IMotoristaRepository) {}

  async executar(input?: ListarMotoristasInput): Promise<Motorista[]> {
    if (input?.nome && input.nome.trim().length < 3) {
      throw new ErroValidacao('Filtro "nome" deve ter no mínimo 3 caracteres')
    }
    return this.repositorio.listar(input)
  }
}
