import { CriarMotoristaUseCase } from '../../../../../src/features/motorista/domain/usecases/criar_motorista.usecase'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { ErroValidacao, ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'
import { Motorista } from '../../../../../src/features/motorista/domain/entity/motorista.entity'

describe('CriarMotoristaUseCase', () => {
  let repositorioMock: jest.Mocked<IMotoristaRepository>
  let useCase: CriarMotoristaUseCase

  beforeEach(() => {
    repositorioMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new CriarMotoristaUseCase(repositorioMock)
  })

  it('deve criar motorista com dados válidos e retornar com id', async () => {
    repositorioMock.obterPorNome.mockResolvedValue(null)
    repositorioMock.salvar.mockImplementation(async (motorista) => motorista)

    const resultado = await useCase.executar({ nome: 'João' })

    expect(resultado).toHaveProperty('id')
    expect(resultado.nome).toBe('João')
    expect(resultado).toHaveProperty('criadoEm')
    expect(resultado).toHaveProperty('atualizadoEm')
    expect(repositorioMock.obterPorNome).toHaveBeenCalledWith('João')
    expect(repositorioMock.salvar).toHaveBeenCalledTimes(1)
  })

  it('deve lançar ErroValidacao quando nome estiver ausente', async () => {
    await expect(useCase.executar({ nome: '' })).rejects.toThrow(ErroValidacao)
    await expect(useCase.executar({ nome: undefined as unknown as string })).rejects.toThrow(ErroValidacao)
  })

  it('deve lançar ErroConflito quando nome ja estiver cadastrado', async () => {
    repositorioMock.obterPorNome.mockResolvedValue({ id: '1', nome: 'João' } as Motorista)

    await expect(useCase.executar({ nome: 'João' })).rejects.toThrow(ErroConflito)

    expect(repositorioMock.salvar).not.toHaveBeenCalled()
  })
})
