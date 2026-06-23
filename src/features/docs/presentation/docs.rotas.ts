import { Router, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const swaggerDocumento = yaml.load(
  fs.readFileSync(path.resolve(__dirname, '../../../../docs/swagger.yaml'), 'utf-8')
) as Record<string, unknown>

export function criarRotasDocs(): Router {
  const router = Router()

  router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  router.use('/docs', swaggerUi.serve)
  router.get('/docs', swaggerUi.setup(swaggerDocumento, {
    customSiteTitle: 'API de Controle de Frotas',
  }))

  return router
}
