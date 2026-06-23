import { AtualizarAutomovelUseCase } from '../../../../../src/features/automovel/domain/usecases/atualizar_automovel.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { Automovel } from '../../../../../src/features/automovel/domain/entity/automovel.entity'
import { ErroNaoEncontrado, ErroValidacao } from '../../../../../src/shared/erros/erro_aplicacao'

const criarAutomovel = (id: string): Automovel => ({
  id,
  placa: 'ABC-1234',
  cor: 'Preto',
  marca: 'Ford',
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('AtualizarAutomovelUseCase', () => {
  let repositorio: jest.Mocked<IAutomovelRepository>
  let useCase: AtualizarAutomovelUseCase

  beforeEach(() => {
    repositorio = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new AtualizarAutomovelUseCase(repositorio)
  })

  it('deve atualizar automovel existente e modificar atualizadoEm', async () => {
    const existente = criarAutomovel('1')
    repositorio.obterPorId.mockResolvedValue(existente)
    repositorio.atualizar.mockImplementation(async (a) => a)

    const dataAntes = Date.now()
    const resultado = await useCase.executar({ id: '1', placa: 'XYZ-9999', cor: 'Azul' })
    const dataDepois = Date.now()

    expect(resultado.placa).toBe('XYZ-9999')
    expect(resultado.cor).toBe('Azul')
    expect(resultado.marca).toBe('Ford')
    expect(resultado.atualizadoEm.getTime()).toBeGreaterThanOrEqual(dataAntes)
    expect(resultado.atualizadoEm.getTime()).toBeLessThanOrEqual(dataDepois)
    expect(repositorio.atualizar).toHaveBeenCalledWith(resultado)
  })

  it('deve lancar ErroNaoEncontrado quando id nao existir', async () => {
    repositorio.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar({ id: 'inexistente', placa: 'XYZ-9999' })).rejects.toThrow(ErroNaoEncontrado)

    expect(repositorio.atualizar).not.toHaveBeenCalled()
  })

  it('deve lancar ErroValidacao quando placa for string vazia', async () => {
    const existente = criarAutomovel('1')
    repositorio.obterPorId.mockResolvedValue(existente)

    await expect(useCase.executar({ id: '1', placa: '' })).rejects.toThrow(ErroValidacao)

    expect(repositorio.atualizar).not.toHaveBeenCalled()
  })
})
