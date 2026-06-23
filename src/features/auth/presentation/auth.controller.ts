import { Request, Response } from 'express'
import { LoginUseCase } from '../domain/usecases/login.usecase'

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    const { usuario, senha } = req.body

    const resultado = await this.loginUseCase.executar({ usuario, senha })

    res.status(200).json(resultado)
  }
}
