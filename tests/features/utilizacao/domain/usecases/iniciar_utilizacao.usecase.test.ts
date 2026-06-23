import { v4 as uuid } from 'uuid'
import { IniciarUtilizacaoUseCase } from '../../../../../src/features/utilizacao/domain/usecases/iniciar_utilizacao.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { ServicoDominioUtilizacao } from '../../../../../src/features/utilizacao/domain/servicos/servico_dominio_utilizacao'
import { ErroValidacao, ErroNaoEncontrado, ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'

jest.mock('uuid')

const FIXED_DATA = new Date('2026-06-22T10:00:00.000Z')

const automovel = { id: 'auto-1', placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat', criadoEm: FIXED_DATA, atualizadoEm: FIXED_DATA }
const motorista = { id: 'motor-1', nome: 'João Silva', criadoEm: FIXED_DATA, atualizadoEm: FIXED_DATA }

describe('IniciarUtilizacaoUseCase', () => {
  let repositorioAutomovel: jest.Mocked<IAutomovelRepository>
  let repositorioMotorista: jest.Mocked<IMotoristaRepository>
  let repositorioUtilizacao: jest.Mocked<IUtilizacaoRepository>
  let servicoDominio: jest.Mocked<ServicoDominioUtilizacao>
  let useCase: IniciarUtilizacaoUseCase

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(FIXED_DATA)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
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
    repositorioUtilizacao = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
      obterUtilizacaoAtivaPorAutomovel: jest.fn(),
      obterUtilizacaoAtivaPorMotorista: jest.fn(),
    }
    servicoDominio = { validarDisponibilidade: jest.fn() } as unknown as jest.Mocked<ServicoDominioUtilizacao>
    useCase = new IniciarUtilizacaoUseCase(
      repositorioAutomovel,
      repositorioMotorista,
      repositorioUtilizacao,
      servicoDominio
    )
    ;(uuid as jest.Mock).mockReturnValue('fixed-uuid')
  })

  it('deve criar utilizacao com dados validos e retornar DTO completo', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(automovel)
    repositorioMotorista.obterPorId.mockResolvedValue(motorista)
    servicoDominio.validarDisponibilidade.mockResolvedValue(undefined)
    repositorioUtilizacao.salvar.mockResolvedValue(undefined as unknown as never)

    const result = await useCase.executar({
      automovelId: 'auto-1',
      motoristaId: 'motor-1',
      motivo: 'Viagem de negócios',
    })

    expect(result).toEqual({
      id: 'fixed-uuid',
      dataInicio: FIXED_DATA,
      dataTermino: null,
      motivo: 'Viagem de negócios',
      motorista: { id: 'motor-1', nome: 'João Silva' },
      automovel: { id: 'auto-1', placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat' },
    })
  })

  it('deve lancar ErroValidacao quando motivo estiver ausente', async () => {
    await expect(
      useCase.executar({ automovelId: 'auto-1', motoristaId: 'motor-1', motivo: '' })
    ).rejects.toThrow(ErroValidacao)
  })

  it('deve lancar ErroNaoEncontrado quando automovel nao for encontrado', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(null)

    await expect(
      useCase.executar({ automovelId: 'auto-1', motoristaId: 'motor-1', motivo: 'Teste' })
    ).rejects.toThrow(ErroNaoEncontrado)
  })

  it('deve lancar ErroNaoEncontrado quando motorista nao for encontrado', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(automovel)
    repositorioMotorista.obterPorId.mockResolvedValue(null)

    await expect(
      useCase.executar({ automovelId: 'auto-1', motoristaId: 'motor-1', motivo: 'Teste' })
    ).rejects.toThrow(ErroNaoEncontrado)
  })

  it('deve lancar ErroConflito quando servicoDominio lancar (automovel em uso)', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(automovel)
    repositorioMotorista.obterPorId.mockResolvedValue(motorista)
    servicoDominio.validarDisponibilidade.mockRejectedValue(
      new ErroConflito('Automóvel já está em uso no momento')
    )

    await expect(
      useCase.executar({ automovelId: 'auto-1', motoristaId: 'motor-1', motivo: 'Teste' })
    ).rejects.toThrow(ErroConflito)
  })
})
