import { AutomovelRepository } from '../../../../src/features/automovel/infra/repository/automovel.repository'
import { IAutomovelDataSource } from '../../../../src/features/automovel/infra/datasource/iautomovel_datasource'
import { Automovel } from '../../../../src/features/automovel/domain/entity/automovel.entity'

const criarAutomovel = (id: string): Automovel => ({
  id,
  placa: 'ABC-1234',
  cor: 'Preto',
  marca: 'Ford',
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('AutomovelRepository', () => {
  let datasource: jest.Mocked<IAutomovelDataSource>
  let repositorio: AutomovelRepository

  beforeEach(() => {
    datasource = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    repositorio = new AutomovelRepository(datasource)
  })

  describe('salvar', () => {
    it('deve delegar para datasource.salvar e retornar Promise', async () => {
      const automovel = criarAutomovel('1')
      datasource.salvar.mockReturnValue(automovel)

      const resultado = await repositorio.salvar(automovel)

      expect(datasource.salvar).toHaveBeenCalledWith(automovel)
      expect(resultado).toEqual(automovel)
    })
  })

  describe('atualizar', () => {
    it('deve delegar para datasource.atualizar e retornar Promise', async () => {
      const automovel = criarAutomovel('1')
      datasource.atualizar.mockReturnValue(automovel)

      const resultado = await repositorio.atualizar(automovel)

      expect(datasource.atualizar).toHaveBeenCalledWith(automovel)
      expect(resultado).toEqual(automovel)
    })
  })

  describe('excluir', () => {
    it('deve delegar para datasource.excluir', async () => {
      datasource.excluir.mockReturnValue(undefined)

      await repositorio.excluir('1')

      expect(datasource.excluir).toHaveBeenCalledWith('1')
    })
  })

  describe('obterPorId', () => {
    it('deve delegar para datasource.obterPorId e retornar Promise', async () => {
      const automovel = criarAutomovel('1')
      datasource.obterPorId.mockReturnValue(automovel)

      const resultado = await repositorio.obterPorId('1')

      expect(datasource.obterPorId).toHaveBeenCalledWith('1')
      expect(resultado).toEqual(automovel)
    })

    it('deve retornar null quando datasource retornar null', async () => {
      datasource.obterPorId.mockReturnValue(null)

      const resultado = await repositorio.obterPorId('inexistente')

      expect(resultado).toBeNull()
    })
  })

  describe('listar', () => {
    it('deve delegar para datasource.listar e retornar Promise', async () => {
      const automoveis = [criarAutomovel('1'), criarAutomovel('2')]
      datasource.listar.mockReturnValue(automoveis)

      const resultado = await repositorio.listar()

      expect(datasource.listar).toHaveBeenCalledWith(undefined)
      expect(resultado).toEqual(automoveis)
    })

    it('deve passar filtros para datasource', async () => {
      datasource.listar.mockReturnValue([])

      await repositorio.listar({ cor: 'Preto', marca: 'Ford' })

      expect(datasource.listar).toHaveBeenCalledWith({ cor: 'Preto', marca: 'Ford' })
    })
  })
})
