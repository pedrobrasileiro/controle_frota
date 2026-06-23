import { CriarAutomovelUseCase } from '../../../../../src/features/automovel/domain/usecases/criar_automovel.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { ErroValidacao } from '../../../../../src/shared/erros/erro_aplicacao'

describe('CriarAutomovelUseCase', () => {
  let repositorio: jest.Mocked<IAutomovelRepository>
  let useCase: CriarAutomovelUseCase

  beforeEach(() => {
    repositorio = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new CriarAutomovelUseCase(repositorio)
  })

  it('deve criar automovel com dados validos', async () => {
    const input = { placa: 'ABC-1234', cor: 'Preto', marca: 'Ford' }
    repositorio.salvar.mockImplementation(async (automovel) => automovel)

    const resultado = await useCase.executar(input)

    expect(resultado.placa).toBe('ABC-1234')
    expect(resultado.cor).toBe('Preto')
    expect(resultado.marca).toBe('Ford')
    expect(resultado.id).toBeDefined()
    expect(resultado.criadoEm).toBeInstanceOf(Date)
    expect(resultado.atualizadoEm).toBeInstanceOf(Date)
    expect(repositorio.salvar).toHaveBeenCalledWith(resultado)
  })

  it('deve lancar ErroValidacao quando campos obrigatorios estiverem faltando', async () => {
    const input = { placa: '', cor: 'Preto', marca: 'Ford' }

    await expect(useCase.executar(input)).rejects.toThrow(ErroValidacao)

    expect(repositorio.salvar).not.toHaveBeenCalled()
  })
})
