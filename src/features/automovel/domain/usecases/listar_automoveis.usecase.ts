import { Automovel } from '../entity/automovel.entity'
import { IAutomovelRepository } from '../repository/automovel.interface.repository'
import { ErroValidacao } from '../../../../shared/erros/erro_aplicacao'

interface ListarAutomoveisInput {
  cor?: string
  marca?: string
}

export class ListarAutomoveisUseCase {
  constructor(private readonly repositorio: IAutomovelRepository) {}

  async executar(input?: ListarAutomoveisInput): Promise<Automovel[]> {
    if (input?.cor && input.cor.trim().length < 3) {
      throw new ErroValidacao('Filtro "cor" deve ter no mínimo 3 caracteres')
    }
    if (input?.marca && input.marca.trim().length < 3) {
      throw new ErroValidacao('Filtro "marca" deve ter no mínimo 3 caracteres')
    }
    return this.repositorio.listar(input)
  }
}
