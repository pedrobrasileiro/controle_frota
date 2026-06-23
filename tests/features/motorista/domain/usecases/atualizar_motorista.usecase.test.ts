import { AtualizarMotoristaUseCase } from '../../../../../src/features/motorista/domain/usecases/atualizar_motorista.usecase'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { ErroNaoEncontrado } from '../../../../../src/shared/erros/erro_aplicacao'
import { Motorista } from '../../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('AtualizarMotoristaUseCase', () => {
  let repositorioMock: jest.Mocked<IMotoristaRepository>
  let useCase: AtualizarMotoristaUseCase

  beforeEach(() => {
    repositorioMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new AtualizarMotoristaUseCase(repositorioMock)
  })

  it('deve atualizar motorista existente, mesclar campos e atualizar atualizadoEm', async () => {
    const existente = criarMotorista({ nome: 'Original' })
    repositorioMock.obterPorId.mockResolvedValue(existente)
    repositorioMock.atualizar.mockImplementation(async (m) => m)

    const resultado = await useCase.executar({ id: '1', nome: 'Atualizado' })

    expect(repositorioMock.obterPorId).toHaveBeenCalledWith('1')
    expect(resultado.id).toBe('1')
    expect(resultado.nome).toBe('Atualizado')
    expect(resultado.criadoEm).toEqual(existente.criadoEm)
    expect(resultado.atualizadoEm).toBeInstanceOf(Date)
    expect(resultado.atualizadoEm.getTime()).toBeGreaterThan(existente.atualizadoEm.getTime())
  })

  it('deve lançar ErroNaoEncontrado quando id não existir', async () => {
    repositorioMock.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar({ id: 'inexistente', nome: 'Novo' })).rejects.toThrow(ErroNaoEncontrado)
  })

})
