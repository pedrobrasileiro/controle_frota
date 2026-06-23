import { Motorista } from '../entity/motorista.entity'
import { IMotoristaRepository } from '../repository/motorista.interface.repository'
import { ErroNaoEncontrado } from '../../../../shared/erros/erro_aplicacao'

interface AtualizarMotoristaInput {
  id: string
  nome?: string
}

export class AtualizarMotoristaUseCase {
  constructor(private readonly repositorio: IMotoristaRepository) {}

  async executar(input: AtualizarMotoristaInput): Promise<Motorista> {
    const existente = await this.repositorio.obterPorId(input.id)
    if (!existente) {
      throw new ErroNaoEncontrado('Motorista não encontrado')
    }

    const atualizado: Motorista = {
      ...existente,
      nome: input.nome ?? existente.nome,
      atualizadoEm: new Date(),
    }

    return this.repositorio.atualizar(atualizado)
  }
}
