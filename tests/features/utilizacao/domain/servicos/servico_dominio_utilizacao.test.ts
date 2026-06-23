import { ServicoDominioUtilizacao } from '../../../../../src/features/utilizacao/domain/servicos/servico_dominio_utilizacao'
import { IUtilizacaoRepository } from '../../../../../src/features/utilizacao/domain/repository/utilizacao.interface.repository'
import { ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'

describe('ServicoDominioUtilizacao', () => {
  let repositorioUtilizacao: jest.Mocked<IUtilizacaoRepository>
  let servico: ServicoDominioUtilizacao

  beforeEach(() => {
    repositorioUtilizacao = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
      obterUtilizacaoAtivaPorAutomovel: jest.fn(),
      obterUtilizacaoAtivaPorMotorista: jest.fn(),
    }
    servico = new ServicoDominioUtilizacao(repositorioUtilizacao)
  })

  it('deve passar quando automovel e motorista estiverem disponiveis', async () => {
    repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel.mockResolvedValue(null)
    repositorioUtilizacao.obterUtilizacaoAtivaPorMotorista.mockResolvedValue(null)

    await expect(
      servico.validarDisponibilidade('auto-1', 'motor-1')
    ).resolves.toBeUndefined()
  })

  it('deve lancar ErroConflito quando automovel estiver em uso', async () => {
    repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel.mockResolvedValue({ id: 'util-1' } as never)
    repositorioUtilizacao.obterUtilizacaoAtivaPorMotorista.mockResolvedValue(null)

    await expect(
      servico.validarDisponibilidade('auto-1', 'motor-1')
    ).rejects.toThrow(ErroConflito)
  })

  it('deve lancar ErroConflito quando motorista estiver em uso', async () => {
    repositorioUtilizacao.obterUtilizacaoAtivaPorAutomovel.mockResolvedValue(null)
    repositorioUtilizacao.obterUtilizacaoAtivaPorMotorista.mockResolvedValue({ id: 'util-2' } as never)

    await expect(
      servico.validarDisponibilidade('auto-1', 'motor-1')
    ).rejects.toThrow(ErroConflito)
  })
})
