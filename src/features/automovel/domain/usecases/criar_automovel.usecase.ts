import { v4 as uuid } from 'uuid'
import { Automovel } from '../entity/automovel.entity'
import { IAutomovelRepository } from '../repository/automovel.interface.repository'
import { ErroValidacao } from '../../../../shared/erros/erro_aplicacao'

interface CriarAutomovelInput {
  placa: string
  cor: string
  marca: string
}

export class CriarAutomovelUseCase {
  constructor(private readonly repositorio: IAutomovelRepository) {}

  async executar(input: CriarAutomovelInput): Promise<Automovel> {
    if (!input.placa || !input.cor || !input.marca) {
      throw new ErroValidacao('Os campos placa, cor e marca são obrigatórios')
    }

    const automovel: Automovel = {
      id: uuid(),
      placa: input.placa,
      cor: input.cor,
      marca: input.marca,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }

    return this.repositorio.salvar(automovel)
  }
}
