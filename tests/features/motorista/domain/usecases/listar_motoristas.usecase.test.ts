import { ListarMotoristasUseCase } from '../../../../../src/features/motorista/domain/usecases/listar_motoristas.usecase'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { Motorista } from '../../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('ListarMotoristasUseCase', () => {
  let repositorioMock: jest.Mocked<IMotoristaRepository>
  let useCase: ListarMotoristasUseCase

  beforeEach(() => {
    repositorioMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new ListarMotoristasUseCase(repositorioMock)
  })

  it('deve retornar lista de motoristas do repositório', async () => {
    const motoristas = [criarMotorista(), criarMotorista({ id: '2', nome: 'Outro' })]
    repositorioMock.listar.mockResolvedValue(motoristas)

    const resultado = await useCase.executar()

    expect(resultado).toEqual(motoristas)
    expect(repositorioMock.listar).toHaveBeenCalledWith(undefined)
  })

  it('deve passar filtros para o repositório', async () => {
    const filtros = { nome: 'Ana' }
    repositorioMock.listar.mockResolvedValue([])

    await useCase.executar(filtros)

    expect(repositorioMock.listar).toHaveBeenCalledWith(filtros)
  })
})
