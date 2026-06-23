import { ExcluirAutomovelUseCase } from '../../../../../src/features/automovel/domain/usecases/excluir_automovel.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { Automovel } from '../../../../../src/features/automovel/domain/entity/automovel.entity'
import { Utilizacao } from '../../../../../src/features/utilizacao/domain/entity/utilizacao.entity'
import { ErroNaoEncontrado, ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'

const criarAutomovel = (id: string): Automovel => ({
  id,
  placa: 'ABC-1234',
  cor: 'Preto',
  marca: 'Ford',
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('ExcluirAutomovelUseCase', () => {
  let repositorioAutomovel: jest.Mocked<IAutomovelRepository>
  let repositorioUtilizacao: jest.Mocked<IUtilizacaoRepository>
  let useCase: ExcluirAutomovelUseCase

  beforeEach(() => {
    repositorioAutomovel = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
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
    useCase = new ExcluirAutomovelUseCase(repositorioAutomovel, repositorioUtilizacao)
  })

  it('deve excluir automovel sem utilizacao ativa', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(criarAutomovel('1'))
    repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel.mockResolvedValue(null)
    repositorioAutomovel.excluir.mockResolvedValue(undefined)

    await useCase.executar('1')

    expect(repositorioAutomovel.obterPorId).toHaveBeenCalledWith('1')
    expect(repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel).toHaveBeenCalledWith('1')
    expect(repositorioAutomovel.excluir).toHaveBeenCalledWith('1')
  })

  it('deve lancar ErroNaoEncontrado quando automovel nao existir', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar('inexistente')).rejects.toThrow(ErroNaoEncontrado)

    expect(repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel).not.toHaveBeenCalled()
    expect(repositorioAutomovel.excluir).not.toHaveBeenCalled()
  })

  it('deve lancar ErroConflito quando automovel tiver utilizacao ativa', async () => {
    repositorioAutomovel.obterPorId.mockResolvedValue(criarAutomovel('1'))
    repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel.mockResolvedValue({} as Utilizacao)

    await expect(useCase.executar('1')).rejects.toThrow(ErroConflito)

    expect(repositorioAutomovel.excluir).not.toHaveBeenCalled()
  })
})
