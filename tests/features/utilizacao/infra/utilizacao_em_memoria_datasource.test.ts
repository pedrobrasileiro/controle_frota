import { UtilizacaoEmMemoriaDataSource } from '../../../../src/features/utilizacao/infra/datasource/utilizacao_em_memoria_datasource'
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

describe('UtilizacaoEmMemoriaDataSource', () => {
  let datasource: UtilizacaoEmMemoriaDataSource

  beforeEach(() => {
    datasource = new UtilizacaoEmMemoriaDataSource()
  })

  it('deve salvar utilizacao e retorna-la', () => {
    const utilizacao = makeUtilizacao()
    const result = datasource.salvar(utilizacao)
    expect(result).toEqual(utilizacao)
    expect(datasource.listar()).toHaveLength(1)
  })

  it('deve retornar utilizacao pelo id', () => {
    const utilizacao = makeUtilizacao()
    datasource.salvar(utilizacao)
    expect(datasource.obterPorId('1')).toEqual(utilizacao)
  })

  it('deve retornar null quando nao encontrar', () => {
    expect(datasource.obterPorId('not-found')).toBeNull()
  })

  it('deve retornar todas as utilizacoes', () => {
    const u1 = makeUtilizacao({ id: '1' })
    const u2 = makeUtilizacao({ id: '2' })
    datasource.salvar(u1)
    datasource.salvar(u2)
    expect(datasource.listar()).toEqual([u1, u2])
  })

  it('deve atualizar utilizacao existente', () => {
    const utilizacao = makeUtilizacao()
    datasource.salvar(utilizacao)
    const atualizada = { ...utilizacao, dataTermino: new Date('2026-06-01') }
    datasource.atualizar(atualizada)
    expect(datasource.obterPorId('1')?.dataTermino).toEqual(atualizada.dataTermino)
  })

  it('deve retornar todas as utilizacoes de um automovel', () => {
    const u1 = makeUtilizacao({ id: '1', automovelId: 'auto-1' })
    const u2 = makeUtilizacao({ id: '2', automovelId: 'auto-1' })
    const u3 = makeUtilizacao({ id: '3', automovelId: 'auto-2' })
    datasource.salvar(u1)
    datasource.salvar(u2)
    datasource.salvar(u3)
    expect(datasource.obterPorAutomovelId('auto-1')).toEqual([u1, u2])
  })

  it('deve retornar todas as utilizacoes de um motorista', () => {
    const u1 = makeUtilizacao({ id: '1', motoristaId: 'motor-1' })
    const u2 = makeUtilizacao({ id: '2', motoristaId: 'motor-1' })
    const u3 = makeUtilizacao({ id: '3', motoristaId: 'motor-2' })
    datasource.salvar(u1)
    datasource.salvar(u2)
    datasource.salvar(u3)
    expect(datasource.obterPorMotoristaId('motor-1')).toEqual([u1, u2])
  })

  describe('listar com filtro apenasAbertas', () => {
    it('deve retornar apenas utilizacoes com dataTermino null quando true', () => {
      const aberta = makeUtilizacao({ id: '1', dataTermino: null })
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.salvar(aberta)
      datasource.salvar(finalizada)

      const resultado = datasource.listar({ apenasAbertas: true })

      expect(resultado).toHaveLength(1)
      expect(resultado[0].id).toBe('1')
    })

    it('deve retornar todas quando false', () => {
      const aberta = makeUtilizacao({ id: '1', dataTermino: null })
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.salvar(aberta)
      datasource.salvar(finalizada)

      const resultado = datasource.listar({ apenasAbertas: false })

      expect(resultado).toHaveLength(2)
    })

    it('deve retornar todas quando filtro nao informado', () => {
      const aberta = makeUtilizacao({ id: '1', dataTermino: null })
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.salvar(aberta)
      datasource.salvar(finalizada)

      const resultado = datasource.listar()

      expect(resultado).toHaveLength(2)
    })

    it('nao deve modificar a lista original ao filtrar', () => {
      const aberta = makeUtilizacao({ id: '1', dataTermino: null })
      const finalizada = makeUtilizacao({ id: '2', dataTermino: new Date('2026-06-01') })
      datasource.salvar(aberta)
      datasource.salvar(finalizada)

      datasource.listar({ apenasAbertas: true })

      expect(datasource.listar()).toHaveLength(2)
    })
  })
})
