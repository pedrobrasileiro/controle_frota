import { ListarAutomoveisUseCase } from '../../../../../src/features/automovel/domain/usecases/listar_automoveis.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { Automovel } from '../../../../../src/features/automovel/domain/entity/automovel.entity'

const criarAutomovel = (id: string): Automovel => ({
  id,
  placa: 'ABC-1234',
  cor: 'Preto',
  marca: 'Ford',
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('ListarAutomoveisUseCase', () => {
  let repositorio: jest.Mocked<IAutomovelRepository>
  let useCase: ListarAutomoveisUseCase

  beforeEach(() => {
    repositorio = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new ListarAutomoveisUseCase(repositorio)
  })

  it('deve retornar lista de automoveis', async () => {
    const automoveis = [criarAutomovel('1'), criarAutomovel('2')]
    repositorio.listar.mockResolvedValue(automoveis)

    const resultado = await useCase.executar()

    expect(resultado).toEqual(automoveis)
    expect(repositorio.listar).toHaveBeenCalledWith(undefined)
  })

  it('deve passar filtros para o repositorio', async () => {
    repositorio.listar.mockResolvedValue([])

    await useCase.executar({ cor: 'Preto', marca: 'Ford' })

    expect(repositorio.listar).toHaveBeenCalledWith({ cor: 'Preto', marca: 'Ford' })
  })
})
