import { Request, Response } from 'express'
import { IniciarUtilizacaoUseCase } from '../domain/usecases/iniciar_utilizacao.usecase'
import { FinalizarUtilizacaoUseCase } from '../domain/usecases/finalizar_utilizacao.usecase'
import { ListarUtilizacoesUseCase } from '../domain/usecases/listar_utilizacoes.usecase'

export class UtilizacaoController {
  constructor(
    private readonly iniciar: IniciarUtilizacaoUseCase,
    private readonly finalizar: FinalizarUtilizacaoUseCase,
    private readonly listar: ListarUtilizacoesUseCase
  ) {}

  async iniciarUtil(req: Request, res: Response): Promise<void> {
    const { automovelId, motoristaId, motivo } = req.body
    const resultado = await this.iniciar.executar({ automovelId, motoristaId, motivo })
    res.status(201).json(resultado)
  }

  async finalizarUtil(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { dataTermino } = req.body
    const resultado = await this.finalizar.executar({
      id,
      dataTermino: dataTermino ? new Date(dataTermino) : undefined,
    })
    res.status(200).json(resultado)
  }

  async listarUtils(req: Request, res: Response): Promise<void> {
    const resultado = await this.listar.executar({
      apenasAbertas: req.query.apenasAbertas as boolean | undefined,
    })
    res.status(200).json(resultado)
  }
}
