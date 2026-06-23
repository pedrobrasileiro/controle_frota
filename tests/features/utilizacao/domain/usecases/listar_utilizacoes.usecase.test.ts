import { ListarUtilizacoesUseCase } from '../../../../../src/features/utilizacao/domain/usecases/listar_utilizacoes.usecase'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'

const FIXED_DATA = new Date('2026-06-22T10:00:00.000Z')

const automovel = { id: 'auto-1', placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat', criadoEm: FIXED_DATA, atualizadoEm: FIXED_DATA }
const motorista = { id: 'motor-1', nome: 'João Silva', criadoEm: FIXED_DATA, atualizadoEm: FIXED_DATA }

const makeUtilizacao = (overrides: Record<string, unknown> = {}) => ({
  id: 'util-1',
  automovelId: 'auto-1',
  motoristaId: 'motor-1',
  dataInicio: new Date('2026-01-01'),
  dataTermino: null,
  motivo: 'Viagem',
  criadoEm: new Date('2026-01-01'),
  ...overrides,
})

describe('ListarUtilizacoesUseCase', () => {
  let repositorioUtilizacao: jest.Mocked<IUtilizacaoRepository>
  let repositorioAutomovel: jest.Mocked<IAutomovelRepository>
  let repositorioMotorista: jest.Mocked<IMotoristaRepository>
  let useCase: ListarUtilizacoesUseCase

  beforeEach(() => {
    repositorioUtilizacao = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
      obterUtilizacaoAtivaPorAutomovel: jest.fn(),
      obterUtilizacaoAtivaPorMotorista: jest.fn(),
    }
    repositorioAutomovel = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorPlaca: jest.fn(),
      listar: jest.fn(),
    }
    repositorioMotorista = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new ListarUtilizacoesUseCase(
      repositorioUtilizacao,
      repositorioAutomovel,
      repositorioMotorista
    )
  })

  it('deve retornar array de DTOs completos com dados aninhados', async () => {
    const utilizacao = makeUtilizacao()
    repositorioUtilizacao.listar.mockResolvedValue([utilizacao])
    repositorioAutomovel.obterPorId.mockResolvedValue(automovel)
    repositorioMotorista.obterPorId.mockResolvedValue(motorista)

    const result = await useCase.executar()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'util-1',
      dataInicio: new Date('2026-01-01'),
      dataTermino: null,
      motivo: 'Viagem',
      motorista: { id: 'motor-1', nome: 'João Silva' },
      automovel: { id: 'auto-1', placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat' },
    })
  })

  it('deve retornar lista vazia quando nao houver utilizacoes', async () => {
    repositorioUtilizacao.listar.mockResolvedValue([])

    const result = await useCase.executar()

    expect(result).toEqual([])
  })

  it('deve passar filtro apenasAbertas para o repositorio', async () => {
    repositorioUtilizacao.listar.mockResolvedValue([])

    await useCase.executar({ apenasAbertas: true })

    expect(repositorioUtilizacao.listar).toHaveBeenCalledWith({ apenasAbertas: true })
  })
})
