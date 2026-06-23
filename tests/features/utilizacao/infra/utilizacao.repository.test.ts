import { UtilizacaoRepository } from '../../../../src/features/utilizacao/infra/repository/utilizacao.repository'
import { IUtilizacaoDataSource } from '../../../../src/features/utilizacao/infra/datasource/iutilizacao_datasource'
import { Utilizacao } from '../../../../src/features/utilizacao/domain/entity/utilizacao.entity'

const makeUtilizacao = (overrides: Partial<Utilizacao> = {}): Utilizacao => ({
  id: '1',
  automovelId: 'auto-1',
  motoristaId: 'motor-1',
  dataInicio: new Date('2026-01-01'),
  dataTermino: null,
  motivo: 'Teste',
  criadoEm: new Date('2026-01-01'),
  ...overrides,
})

describe('UtilizacaoRepository', () => {
  let datasource: jest.Mocked<IUtilizacaoDataSource>
  let repository: UtilizacaoRepository

  beforeEach(() => {
    datasource = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
      obterPorAutomovelId: jest.fn(),
      obterPorMotoristaId: jest.fn(),
    }
    repository = new UtilizacaoRepository(datasource)
  })

  it('deve delegar salvar ao datasource', async () => {
    const utilizacao = makeUtilizacao()
    datasource.salvar.mockReturnValue(utilizacao)
    const result = await repository.salvar(utilizacao)
    expect(datasource.salvar).toHaveBeenCalledWith(utilizacao)
    expect(result).toEqual(utilizacao)
  })

  it('deve delegar atualizar ao datasource', async () => {
    const utilizacao = makeUtilizacao()
    datasource.atualizar.mockReturnValue(utilizacao)
    const result = await repository.atualizar(utilizacao)
    expect(datasource.atualizar).toHaveBeenCalledWith(utilizacao)
    expect(result).toEqual(utilizacao)
  })

  it('deve delegar obterPorId ao datasource', async () => {
    const utilizacao = makeUtilizacao()
    datasource.obterPorId.mockReturnValue(utilizacao)
    const result = await repository.obterPorId('1')
    expect(datasource.obterPorId).toHaveBeenCalledWith('1')
    expect(result).toEqual(utilizacao)
  })

  it('deve retornar null quando nao encontrar', async () => {
    datasource.obterPorId.mockReturnValue(null)
    const result = await repository.obterPorId('not-found')
    expect(result).toBeNull()
  })

  it('deve delegar listar ao datasource', async () => {
    const list = [makeUtilizacao()]
    datasource.listar.mockReturnValue(list)
    const result = await repository.listar()
    expect(datasource.listar).toHaveBeenCalled()
    expect(result).toEqual(list)
  })

  describe('obterUtilizacaoAtivaPorAutomovel', () => {
    it('deve retornar utilizacao ativa quando dataTermino for null', async () => {
      const ativa = makeUtilizacao({ id: '1', dataTermino: null })
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.obterPorAutomovelId.mockReturnValue([ativa, finalizada])
      const result = await repository.obterUtilizacaoAtivaPorAutomovel('auto-1')
      expect(result).toEqual(ativa)
    })

    it('deve retornar null quando nenhuma estiver ativa', async () => {
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.obterPorAutomovelId.mockReturnValue([finalizada])
      const result = await repository.obterUtilizacaoAtivaPorAutomovel('auto-1')
      expect(result).toBeNull()
    })

    it('deve retornar null quando nao houver utilizacoes para o automovel', async () => {
      datasource.obterPorAutomovelId.mockReturnValue([])
      const result = await repository.obterUtilizacaoAtivaPorAutomovel('auto-1')
      expect(result).toBeNull()
    })
  })

  describe('obterUtilizacaoAtivaPorMotorista', () => {
    it('deve retornar utilizacao ativa quando dataTermino for null', async () => {
      const ativa = makeUtilizacao({ id: '1', dataTermino: null })
      datasource.obterPorMotoristaId.mockReturnValue([ativa])
      const result = await repository.obterUtilizacaoAtivaPorMotorista('motor-1')
      expect(result).toEqual(ativa)
    })

    it('deve retornar null quando nenhuma estiver ativa', async () => {
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.obterPorMotoristaId.mockReturnValue([finalizada])
      const result = await repository.obterUtilizacaoAtivaPorMotorista('motor-1')
      expect(result).toBeNull()
    })

    it('deve retornar null quando nao houver utilizacoes para o motorista', async () => {
      datasource.obterPorMotoristaId.mockReturnValue([])
      const result = await repository.obterUtilizacaoAtivaPorMotorista('motor-1')
      expect(result).toBeNull()
    })
  })
})
