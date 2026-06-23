import { ExcluirMotoristaUseCase } from '../../../../../src/features/motorista/domain/usecases/excluir_motorista.usecase'
import { IMotoristaRepository } from '../../../../../src/features/motorista/domain/repository/motorista.interface.repository'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { ErroNaoEncontrado, ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'
import { Motorista } from '../../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('ExcluirMotoristaUseCase', () => {
  let repositorioMotoristaMock: jest.Mocked<IMotoristaRepository>
  let repositorioUtilizacaoMock: jest.Mocked<IUtilizacaoRepository>
  let useCase: ExcluirMotoristaUseCase

  beforeEach(() => {
    repositorioMotoristaMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorNome: jest.fn(),
      listar: jest.fn(),
    }
    repositorioUtilizacaoMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
      obterUtilizacaoAtivaPorAutomovel: jest.fn(),
      obterUtilizacaoAtivaPorMotorista: jest.fn(),
    }
    useCase = new ExcluirMotoristaUseCase(repositorioMotoristaMock, repositorioUtilizacaoMock)
  })

  it('deve excluir motorista sem utilização ativa', async () => {
    const motorista = criarMotorista()
    repositorioMotoristaMock.obterPorId.mockResolvedValue(motorista)
    repositorioUtilizacaoMock.obterUtilizacaoAtivaPorMotorista.mockResolvedValue(null)

    await useCase.executar('1')

    expect(repositorioMotoristaMock.obterPorId).toHaveBeenCalledWith('1')
    expect(repositorioUtilizacaoMock.obterUtilizacaoAtivaPorMotorista).toHaveBeenCalledWith('1')
    expect(repositorioMotoristaMock.excluir).toHaveBeenCalledWith('1')
  })

  it('deve lançar ErroNaoEncontrado quando motorista não existir', async () => {
    repositorioMotoristaMock.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar('inexistente')).rejects.toThrow(ErroNaoEncontrado)
    expect(repositorioMotoristaMock.excluir).not.toHaveBeenCalled()
  })

  it('deve lançar ErroConflito quando motorista tiver utilização ativa', async () => {
    const motorista = criarMotorista()
    repositorioMotoristaMock.obterPorId.mockResolvedValue(motorista)
    repositorioUtilizacaoMock.obterUtilizacaoAtivaPorMotorista.mockResolvedValue({} as any)

    await expect(useCase.executar('1')).rejects.toThrow(ErroConflito)
    expect(repositorioMotoristaMock.excluir).not.toHaveBeenCalled()
  })
})
