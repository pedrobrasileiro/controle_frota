import { Router } from 'express'
import { AutomovelController } from './automovel.controller'
import { validarCamposObrigatorios } from '../../../shared/middleware/validacao'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'

export function criarRotasAutomovel(controlador: AutomovelController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/automoveis',
    validarCamposObrigatorios('placa', 'cor', 'marca'),
    assyncHandler((req, res) => controlador.criarAuto(req, res))
  )

  router.put('/automoveis/:id', assyncHandler((req, res) => controlador.atualizarAuto(req, res)))

  router.delete('/automoveis/:id', assyncHandler((req, res) => controlador.excluirAuto(req, res)))

  router.get('/automoveis/:id', assyncHandler((req, res) => controlador.obterAuto(req, res)))

  router.get('/automoveis', assyncHandler((req, res) => controlador.listarAutos(req, res)))

  return router
}
