import { ObterAutomovelUseCase } from '../../../../../src/features/automovel/domain/usecases/obter_automovel.usecase'
import { IAutomovelRepository } from '../../../../../src/features/automovel/domain/repository/automovel.interface.repository'
import { Automovel } from '../../../../../src/features/automovel/domain/entity/automovel.entity'
import { ErroNaoEncontrado } from '../../../../../src/shared/erros/erro_aplicacao'

const criarAutomovel = (id: string): Automovel => ({
  id,
  placa: 'ABC-1234',
  cor: 'Preto',
  marca: 'Ford',
  criadoEm: new Date('2026-01-01'),
  atualizadoEm: new Date('2026-01-01'),
})

describe('ObterAutomovelUseCase', () => {
  let repositorio: jest.Mocked<IAutomovelRepository>
  let useCase: ObterAutomovelUseCase

  beforeEach(() => {
    repositorio = {
      salvar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      obterPorId: jest.fn(),
      listar: jest.fn(),
    }
    useCase = new ObterAutomovelUseCase(repositorio)
  })

  it('deve retornar automovel quando encontrado', async () => {
    const automovel = criarAutomovel('1')
    repositorio.obterPorId.mockResolvedValue(automovel)

    const resultado = await useCase.executar('1')

    expect(resultado).toEqual(automovel)
    expect(repositorio.obterPorId).toHaveBeenCalledWith('1')
  })

  it('deve lancar ErroNaoEncontrado quando nao encontrado', async () => {
    repositorio.obterPorId.mockResolvedValue(null)

    await expect(useCase.executar('inexistente')).rejects.toThrow(ErroNaoEncontrado)
  })
})
