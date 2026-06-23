import { Request, Response } from 'express'
import { CriarAutomovelUseCase } from '../domain/usecases/criar_automovel.usecase'
import { AtualizarAutomovelUseCase } from '../domain/usecases/atualizar_automovel.usecase'
import { ExcluirAutomovelUseCase } from '../domain/usecases/excluir_automovel.usecase'
import { ObterAutomovelUseCase } from '../domain/usecases/obter_automovel.usecase'
import { ListarAutomoveisUseCase } from '../domain/usecases/listar_automoveis.usecase'

export class AutomovelController {
  constructor(
    private readonly criar: CriarAutomovelUseCase,
    private readonly atualizar: AtualizarAutomovelUseCase,
    private readonly excluir: ExcluirAutomovelUseCase,
    private readonly obter: ObterAutomovelUseCase,
    private readonly listar: ListarAutomoveisUseCase
  ) {}

  async criarAuto(req: Request, res: Response): Promise<void> {
    const { placa, cor, marca } = req.body
    const resultado = await this.criar.executar({ placa, cor, marca })
    res.status(201).json(resultado)
  }

  async atualizarAuto(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { placa, cor, marca } = req.body
    const resultado = await this.atualizar.executar({ id, placa, cor, marca })
    res.status(200).json(resultado)
  }

  async excluirAuto(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    await this.excluir.executar(id)
    res.status(204).send()
  }

  async obterAuto(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const resultado = await this.obter.executar(id)
    res.status(200).json(resultado)
  }

  async listarAutos(req: Request, res: Response): Promise<void> {
    const { cor, marca } = req.query
    const resultado = await this.listar.executar({
      cor: cor as string | undefined,
      marca: marca as string | undefined,
    })
    res.status(200).json(resultado)
  }
}
