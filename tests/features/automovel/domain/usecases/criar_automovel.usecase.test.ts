import { CriarAutomovelUseCase } from '../../../../../src/features/automovel/domain/usecases/criar_automovel.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { ErroConflito } from '../../../../../src/shared/erros/erro_aplicacao'

describe('CriarAutomovelUseCase', () => {
  let repositorio: jest.Mocked<IAutomovelRepository>
  let useCase: CriarAutomovelUseCase

  beforeEach(() => {
    repositorio = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      obterPorPlaca: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new CriarAutomovelUseCase(repositorio)
  })

  it('deve criar automovel com dados validos', async () => {
    const input = { placa: 'ABC-1234', cor: 'Preto', marca: 'Ford' }
    repositorio.obterPorPlaca.mockResolvedValue(null)
    repositorio.salvar.mockImplementation(async (automovel) => automovel)

    const resultado = await useCase.executar(input)

    expect(resultado.placa).toBe('ABC-1234')
    expect(resultado.cor).toBe('Preto')
    expect(resultado.marca).toBe('Ford')
    expect(resultado.id).toBeDefined()
    expect(resultado.criadoEm).toBeInstanceOf(Date)
    expect(resultado.atualizadoEm).toBeInstanceOf(Date)
    expect(repositorio.obterPorPlaca).toHaveBeenCalledWith('ABC-1234')
    expect(repositorio.salvar).toHaveBeenCalledWith(resultado)
  })

  it('deve lancar ErroConflito quando placa ja estiver cadastrada', async () => {
    const input = { placa: 'ABC-1234', cor: 'Preto', marca: 'Ford' }
    repositorio.obterPorPlaca.mockResolvedValue({ id: '1', placa: 'ABC-1234', cor: 'Branco', marca: 'Fiat' } as any)

    await expect(useCase.executar(input)).rejects.toThrow(ErroConflito)

    expect(repositorio.salvar).not.toHaveBeenCalled()
  })
})
