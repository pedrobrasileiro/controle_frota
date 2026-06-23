import { Request, Response } from 'express'
import { CriarMotoristaUseCase } from '../domain/usecases/criar_motorista.usecase'
import { AtualizarMotoristaUseCase } from '../domain/usecases/atualizar_motorista.usecase'
import { ExcluirMotoristaUseCase } from '../domain/usecases/excluir_motorista.usecase'
import { ObterMotoristaUseCase } from '../domain/usecases/obter_motorista.usecase'
import { ListarMotoristasUseCase } from '../domain/usecases/listar_motoristas.usecase'

export class MotoristaController {
  constructor(
    private readonly criar: CriarMotoristaUseCase,
    private readonly atualizar: AtualizarMotoristaUseCase,
    private readonly excluir: ExcluirMotoristaUseCase,
    private readonly obter: ObterMotoristaUseCase,
    private readonly listar: ListarMotoristasUseCase
  ) {}

  async criarMotor(req: Request, res: Response): Promise<void> {
    const { nome } = req.body
    const resultado = await this.criar.executar({ nome })
    res.status(201).json(resultado)
  }

  async atualizarMotor(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { nome } = req.body
    const resultado = await this.atualizar.executar({ id, nome })
    res.status(200).json(resultado)
  }

  async excluirMotor(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    await this.excluir.executar(id)
    res.status(204).send()
  }

  async obterMotor(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const resultado = await this.obter.executar(id)
    res.status(200).json(resultado)
  }

  async listarMotores(req: Request, res: Response): Promise<void> {
    const { nome } = req.query
    const resultado = await this.listar.executar({ nome: nome as string | undefined })
    res.status(200).json(resultado)
  }
}
