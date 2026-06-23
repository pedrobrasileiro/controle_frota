import { FinalizarUtilizacaoUseCase } from '../../../../../src/features/utilizacao/domain/usecases/finalizar_utilizacao.usecase'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { ErroNaoEncontrado, ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'

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

describe('FinalizarUtilizacaoUseCase', () => {
  let repositorioUtilizacao: jest.Mocked<IUtilizacaoRepository>
  let repositorioAutomovel: jest.Mocked<IAutomovelRepository>
  let repositorioMotorista: jest.Mocked<IMotoristaRepository>
  let useCase: FinalizarUtilizacaoUseCase

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(FIXED_DATA)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

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
      listar: jest.fn(),
    }
    repositorioMotorista = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new FinalizarUtilizacaoUseCase(
      repositorioUtilizacao,
      repositorioAutomovel,
      repositorioMotorista
    )
  })

  it('deve definir dataTermino na utilizacao existente e retornar DTO', async () => {
    const utilizacao = makeUtilizacao()
    repositorioUtilizacao.obterPorId.mockResolvedValue(utilizacao)
    repositorioAutomovel.obterPorId.mockResolvedValue(automovel)
    repositorioMotorista.obterPorId.mockResolvedValue(motorista)
    repositorioUtilizacao.atualizar.mockResolvedValue(undefined as unknown as never)

    const result = await useCase.executar({ id: 'util-1' })

    expect(result.id).toBe('util-1')
    expect(result.dataTermino).toEqual(FIXED_DATA)
    expect(result.motorista).toEqual({ id: 'motor-1', nome: 'João Silva' })
    expect(result.automovel).toEqual({ id: 'auto-1', placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat' })
    expect(repositorioUtilizacao.atualizar).toHaveBeenCalled()
  })

  it('deve lancar ErroNaoEncontrado quando utilizacao nao for encontrada', async () => {
    repositorioUtilizacao.obterPorId.mockResolvedValue(null)

    await expect(
      useCase.executar({ id: 'not-found' })
    ).rejects.toThrow(ErroNaoEncontrado)
  })

  it('deve lancar ErroConflito quando utilizacao ja tiver dataTermino', async () => {
    const utilizacao = makeUtilizacao({ dataTermino: new Date('2026-06-01') })
    repositorioUtilizacao.obterPorId.mockResolvedValue(utilizacao)

    await expect(
      useCase.executar({ id: 'util-1' })
    ).rejects.toThrow(ErroConflito)
  })
})
