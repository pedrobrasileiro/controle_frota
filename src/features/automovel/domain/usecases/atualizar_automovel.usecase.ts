import { Automovel } from '../entity/automovel.entity'
import { IAutomovelRepository } from '../repository/automovel.interface.repository'
import { ErroNaoEncontrado } from '../../../../shared/erros/erro_aplicacao'

interface AtualizarAutomovelInput {
  id: string
  placa?: string
  cor?: string
  marca?: string
}

export class AtualizarAutomovelUseCase {
  constructor(private readonly repositorio: IAutomovelRepository) {}

  async executar(input: AtualizarAutomovelInput): Promise<Automovel> {
    const existente = await this.repositorio.obterPorId(input.id)
    if (!existente) {
      throw new ErroNaoEncontrado('Automóvel não encontrado')
    }

    const atualizado: Automovel = {
      ...existente,
      placa: input.placa ?? existente.placa,
      cor: input.cor ?? existente.cor,
      marca: input.marca ?? existente.marca,
      atualizadoEm: new Date(),
    }

    return this.repositorio.atualizar(atualizado)
  }
}
