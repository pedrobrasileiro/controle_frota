import { AutomovelEmMemoriaDataSource } from '../../../../src/features/automovel/infra/datasource/automovel_em_memoria_datasource'
import { Automovel } from '../../../../src/features/automovel/domain/entity/automovel.entity'

const criarAutomovel = (id: string, placa: string, cor: string, marca: string): Automovel => ({
  id, placa, cor, marca,
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('AutomovelEmMemoriaDataSource', () => {
  let datasource: AutomovelEmMemoriaDataSource

  beforeEach(() => {
    datasource = new AutomovelEmMemoriaDataSource()
  })

  describe('salvar', () => {
    it('deve adicionar automovel e retorná-lo', () => {
      const automovel = criarAutomovel('1', 'ABC-1234', 'Preto', 'Ford')

      const resultado = datasource.salvar(automovel)

      expect(resultado).toEqual(automovel)
    })
  })

  describe('obterPorId', () => {
    it('deve retornar automovel pelo id', () => {
      const automovel = criarAutomovel('1', 'ABC-1234', 'Preto', 'Ford')
      datasource.salvar(automovel)

      const resultado = datasource.obterPorId('1')

      expect(resultado).toEqual(automovel)
    })

    it('deve retornar null quando nao encontrar', () => {
      const resultado = datasource.obterPorId('inexistente')

      expect(resultado).toBeNull()
    })
  })

  describe('listar', () => {
    beforeEach(() => {
      datasource.salvar(criarAutomovel('1', 'ABC-1234', 'Preto', 'Ford'))
      datasource.salvar(criarAutomovel('2', 'DEF-5678', 'Branco', 'Chevrolet'))
      datasource.salvar(criarAutomovel('3', 'GHI-9012', 'Preto', 'Chevrolet'))
    })

    it('deve retornar todos os automoveis', () => {
      const resultado = datasource.listar()

      expect(resultado).toHaveLength(3)
    })

    it('deve filtrar por cor', () => {
      const resultado = datasource.listar({ cor: 'Preto' })

      expect(resultado).toHaveLength(2)
      expect(resultado.every((a) => a.cor === 'Preto')).toBe(true)
    })

    it('deve filtrar por marca', () => {
      const resultado = datasource.listar({ marca: 'Chevrolet' })

      expect(resultado).toHaveLength(2)
      expect(resultado.every((a) => a.marca === 'Chevrolet')).toBe(true)
    })

    it('deve filtrar por cor e marca em combinacao', () => {
      const resultado = datasource.listar({ cor: 'Preto', marca: 'Ford' })

      expect(resultado).toHaveLength(1)
      expect(resultado[0].id).toBe('1')
    })
  })

  describe('atualizar', () => {
    it('deve atualizar automovel existente', () => {
      const automovel = criarAutomovel('1', 'ABC-1234', 'Preto', 'Ford')
      datasource.salvar(automovel)
      const atualizado = { ...automovel, placa: 'XYZ-9999' }

      const resultado = datasource.atualizar(atualizado)

      expect(resultado.placa).toBe('XYZ-9999')
      const obtido = datasource.obterPorId('1')
      expect(obtido?.placa).toBe('XYZ-9999')
    })
  })

  describe('excluir', () => {
    it('deve remover automovel pelo id', () => {
      const automovel = criarAutomovel('1', 'ABC-1234', 'Preto', 'Ford')
      datasource.salvar(automovel)

      datasource.excluir('1')

      expect(datasource.obterPorId('1')).toBeNull()
    })
  })
})
