import { MotoristaRepository } from '../../../../src/features/motorista/infra/repository/motorista.repository'
import { IMotoristaDataSource } from '../../../../src/features/motorista/infra/datasource/imotorista_datasource'
import { Motorista } from '../../../../src/features/motorista/domain/entity/motorista.entity'

const criarMotorista = (dados?: Partial<Motorista>): Motorista => ({
  id: dados?.id ?? '1',
  nome: dados?.nome ?? 'Motorista Teste',
  criadoEm: dados?.criadoEm ?? new Date('2024-01-01'),
  atualizadoEm: dados?.atualizadoEm ?? new Date('2024-01-01'),
})

describe('MotoristaRepository', () => {
  let datasourceMock: jest.Mocked<IMotoristaDataSource>
  let repositorio: MotoristaRepository

  beforeEach(() => {
    datasourceMock = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    repositorio = new MotoristaRepository(datasourceMock)
  })

  describe('salvar', () => {
    it('deve delegar ao datasource e retornar motorista', async () => {
      const motorista = criarMotorista()
      datasourceMock.salvar.mockReturnValue(motorista)
      const resultado = await repositorio.salvar(motorista)
      expect(datasourceMock.salvar).toHaveBeenCalledWith(motorista)
      expect(resultado).toEqual(motorista)
    })
  })

  describe('atualizar', () => {
    it('deve delegar ao datasource e retornar motorista atualizado', async () => {
      const motorista = criarMotorista({ nome: 'Atualizado' })
      datasourceMock.atualizar.mockReturnValue(motorista)
      const resultado = await repositorio.atualizar(motorista)
      expect(datasourceMock.atualizar).toHaveBeenCalledWith(motorista)
      expect(resultado).toEqual(motorista)
    })
  })

  describe('excluir', () => {
    it('deve delegar ao datasource', async () => {
      await repositorio.excluir('1')
      expect(datasourceMock.excluir).toHaveBeenCalledWith('1')
    })
  })

  describe('obterPorId', () => {
    it('deve delegar ao datasource e retornar motorista', async () => {
      const motorista = criarMotorista()
      datasourceMock.obterPorId.mockReturnValue(motorista)
      const resultado = await repositorio.obterPorId('1')
      expect(datasourceMock.obterPorId).toHaveBeenCalledWith('1')
      expect(resultado).toEqual(motorista)
    })

    it('deve delegar ao datasource e retornar null', async () => {
      datasourceMock.obterPorId.mockReturnValue(null)
      const resultado = await repositorio.obterPorId('inexistente')
      expect(resultado).toBeNull()
    })
  })

  describe('listar', () => {
    it('deve delegar ao datasource e retornar lista', async () => {
      const motorista = criarMotorista()
      datasourceMock.listar.mockReturnValue([motorista])
      const resultado = await repositorio.listar()
      expect(datasourceMock.listar).toHaveBeenCalledWith(undefined)
      expect(resultado).toEqual([motorista])
    })

    it('deve delegar filtros ao datasource', async () => {
      const filtros = { nome: 'Ana' }
      datasourceMock.listar.mockReturnValue([])
      await repositorio.listar(filtros)
      expect(datasourceMock.listar).toHaveBeenCalledWith(filtros)
    })
  })
})
