import { Request, Response, NextFunction } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export function assyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
