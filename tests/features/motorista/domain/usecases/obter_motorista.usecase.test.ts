import { ObterMotoristaUseCase } from '../../../../../src/features/motorista/domain/usecases/obter_motorista.usecase'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { ErroNaoEncontrado } from '../../../../../src/shared/erros/erro_aplicacao'
import { Motorista } from '../../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('ObterMotoristaUseCase', () => {
  let repositorioMock: jest.Mocked<IMotoristaRepository>
  let useCase: ObterMotoristaUseCase

  beforeEach(() => {
    repositorioMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new ObterMotoristaUseCase(repositorioMock)
  })

  it('deve retornar motorista quando encontrado', async () => {
    const motorista = criarMotorista()
    repositorioMock.obterPorId.mockResolvedValue(motorista)

    const resultado = await useCase.executar('1')

    expect(resultado).toEqual(motorista)
    expect(repositorioMock.obterPorId).toHaveBeenCalledWith('1')
  })

  it('deve lançar ErroNaoEncontrado quando motorista não for encontrado', async () => {
    repositorioMock.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar('inexistente')).rejects.toThrow(ErroNaoEncontrado)
  })
})
