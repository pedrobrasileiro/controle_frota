import { v4 as uuid } from 'uuid'
import { Motorista } from '../entity/motorista.entity'
import { IMotoristaRepository } from '../repository/motorista.interface.repository'
import { ErroValidacao, ErroConflito } from '../../../../shared/erros/erro_aplicacao'

interface CriarMotoristaInput {
  nome: string
}

export class CriarMotoristaUseCase {
  constructor(private readonly repositorio: IMotoristaRepository) {}

  async executar(input: CriarMotoristaInput): Promise<Motorista> {
    if (!input.nome) {
      throw new ErroValidacao('O campo nome é obrigatório')
    }

    const existente = await this.repositorio.obterPorNome(input.nome)
    if (existente) {
      throw new ErroConflito('Já existe um motorista cadastrado com este nome')
    }

    const motorista: Motorista = {
      id: uuid(),
      nome: input.nome,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }

    return this.repositorio.salvar(motorista)
  }
}
