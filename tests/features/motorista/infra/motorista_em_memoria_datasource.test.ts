import { MotoristaEmMemoriaDataSource } from '../../../../src/features/motorista/infra/datasource/motorista_em_memoria_datasource'
import { Motorista } from '../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('MotoristaEmMemoriaDataSource', () => {
  let datasource: MotoristaEmMemoriaDataSource

  beforeEach(() => {
    datasource = new MotoristaEmMemoriaDataSource()
  })

  describe('salvar', () => {
    it('deve adicionar motorista e retorná-lo', () => {
      const motorista = criarMotorista()
      const resultado = datasource.salvar(motorista)
      expect(resultado).toEqual(motorista)
    })
  })

  describe('obterPorId', () => {
    it('deve retornar motorista pelo id', () => {
      const motorista = criarMotorista()
      datasource.salvar(motorista)
      const resultado = datasource.obterPorId('1')
      expect(resultado).toEqual(motorista)
    })

    it('deve retornar null se não encontrado', () => {
      const resultado = datasource.obterPorId('inexistente')
      expect(resultado).toBeNull()
    })
  })

  describe('listar', () => {
    it('deve retornar todos os motoristas sem filtro', () => {
      const m1 = criarMotorista({ id: '1', nome: 'Ana' })
      const m2 = criarMotorista({ id: '2', nome: 'Bruno' })
      datasource.salvar(m1)
      datasource.salvar(m2)
      const resultado = datasource.listar()
      expect(resultado).toHaveLength(2)
      expect(resultado).toContainEqual(m1)
      expect(resultado).toContainEqual(m2)
    })

    it('deve filtrar por nome com case-insensitive partial match', () => {
      const m1 = criarMotorista({ id: '1', nome: 'Fernanda' })
      const m2 = criarMotorista({ id: '2', nome: 'Rafael' })
      datasource.salvar(m1)
      datasource.salvar(m2)
      const resultado = datasource.listar({ nome: 'fern' })
      expect(resultado).toHaveLength(1)
      expect(resultado[0]).toEqual(m1)
    })
  })

  describe('atualizar', () => {
    it('deve atualizar motorista existente', () => {
      const motorista = criarMotorista()
      datasource.salvar(motorista)
      const atualizado = { ...motorista, nome: 'Atualizado' }
      const resultado = datasource.atualizar(atualizado)
      expect(resultado).toEqual(atualizado)
      expect(datasource.obterPorId('1')?.nome).toBe('Atualizado')
    })
  })

  describe('excluir', () => {
    it('deve remover motorista pelo id', () => {
      const motorista = criarMotorista()
      datasource.salvar(motorista)
      datasource.excluir('1')
      expect(datasource.obterPorId('1')).toBeNull()
    })
  })
})
