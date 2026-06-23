import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const swaggerDocumento = yaml.load(
  fs.readFileSync(path.resolve(__dirname, '../../../../docs/swagger.yaml'), 'utf-8')
) as Record<string, unknown>

export function criarRotasDocs(): Router {
  const router = Router()

  router.use('/docs', swaggerUi.serve)
  router.get('/docs', swaggerUi.setup(swaggerDocumento, {
    customSiteTitle: 'API de Controle de Frotas',
  }))

  return router
}
