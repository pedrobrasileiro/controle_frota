import { Router } from 'express'

import { AutomovelEmMemoriaDataSource } from '../features/automovel/infra/datasource/automovel_em_memoria_datasource'
import { AutomovelRepository } from '../features/automovel/infra/repository/automovel.repository'
import { CriarAutomovelUseCase } from '../features/automovel/domain/usecases/criar_automovel.usecase'
import { AtualizarAutomovelUseCase } from '../features/automovel/domain/usecases/atualizar_automovel.usecase'
import { ExcluirAutomovelUseCase } from '../features/automovel/domain/usecases/excluir_automovel.usecase'
import { ObterAutomovelUseCase } from '../features/automovel/domain/usecases/obter_automovel.usecase'
import { ListarAutomoveisUseCase } from '../features/automovel/domain/usecases/listar_automoveis.usecase'
import { AutomovelController } from '../features/automovel/presentation/automovel.controller'
import { criarRotasAutomovel } from '../features/automovel/presentation/automoveis.rotas'

import { MotoristaEmMemoriaDataSource } from '../features/motorista/infra/datasource/motorista_em_memoria_datasource'
import { MotoristaRepository } from '../features/motorista/infra/repository/motorista.repository'
import { CriarMotoristaUseCase } from '../features/motorista/domain/usecases/criar_motorista.usecase'
import { AtualizarMotoristaUseCase } from '../features/motorista/domain/usecases/atualizar_motorista.usecase'
import { ExcluirMotoristaUseCase } from '../features/motorista/domain/usecases/excluir_motorista.usecase'
import { ObterMotoristaUseCase } from '../features/motorista/domain/usecases/obter_motorista.usecase'
import { ListarMotoristasUseCase } from '../features/motorista/domain/usecases/listar_motoristas.usecase'
import { MotoristaController } from '../features/motorista/presentation/motorista.controller'
import { criarRotasMotorista } from '../features/motorista/presentation/motoristas.rotas'

import { UtilizacaoEmMemoriaDataSource } from '../features/utilizacao/infra/datasource/utilizacao_em_memoria_datasource'
import { UtilizacaoRepository } from '../features/utilizacao/infra/repository/utilizacao.repository'
import { ServicoDominioUtilizacao } from '../features/utilizacao/domain/servicos/servico_dominio_utilizacao'
import { IniciarUtilizacaoUseCase } from '../features/utilizacao/domain/usecases/iniciar_utilizacao.usecase'
import { FinalizarUtilizacaoUseCase } from '../features/utilizacao/domain/usecases/finalizar_utilizacao.usecase'
import { ListarUtilizacoesUseCase } from '../features/utilizacao/domain/usecases/listar_utilizacoes.usecase'
import { UtilizacaoController } from '../features/utilizacao/presentation/utilizacao.controller'
import { criarRotasUtilizacao } from '../features/utilizacao/presentation/utilizacoes.rotas'

import { LoginUseCase } from '../features/auth/domain/usecases/login.usecase'
import { AuthController } from '../features/auth/presentation/auth.controller'
import { criarRotasAuth } from '../features/auth/presentation/auth.rotas'
import { AuthMockDataSource } from '../features/auth/infra/datasource/auth_mock_datasource'
import { AuthRepository } from '../features/auth/infra/repository/auth.repository'
import { criarRotasDocs } from '../features/docs/presentation/docs.rotas'

export function comporRotas(): Router {
  const rotas = Router()

  // Datasources
  const datasourceAutomovel = new AutomovelEmMemoriaDataSource()
  const datasourceMotorista = new MotoristaEmMemoriaDataSource()
  const datasourceUtilizacao = new UtilizacaoEmMemoriaDataSource()
  const datasourceAuth = new AuthMockDataSource()

  // Repositories
  const repositorioAutomovel = new AutomovelRepository(datasourceAutomovel)
  const repositorioMotorista = new MotoristaRepository(datasourceMotorista)
  const repositorioUtilizacao = new UtilizacaoRepository(datasourceUtilizacao)
  const repositorioAuth = new AuthRepository(datasourceAuth)

  // Domain services
  const servicoDominioUtilizacao = new ServicoDominioUtilizacao(repositorioUtilizacao)

  // Use cases - Auth
  const loginUseCase = new LoginUseCase(repositorioAuth)

  // Use cases - Automovel
  const criarAutomovel = new CriarAutomovelUseCase(repositorioAutomovel)
  const atualizarAutomovel = new AtualizarAutomovelUseCase(repositorioAutomovel)
  const excluirAutomovel = new ExcluirAutomovelUseCase(repositorioAutomovel, repositorioUtilizacao)
  const obterAutomovel = new ObterAutomovelUseCase(repositorioAutomovel)
  const listarAutomoveis = new ListarAutomoveisUseCase(repositorioAutomovel)

  // Use cases - Motorista
  const criarMotorista = new CriarMotoristaUseCase(repositorioMotorista)
  const atualizarMotorista = new AtualizarMotoristaUseCase(repositorioMotorista)
  const excluirMotorista = new ExcluirMotoristaUseCase(repositorioMotorista, repositorioUtilizacao)
  const obterMotorista = new ObterMotoristaUseCase(repositorioMotorista)
  const listarMotoristas = new ListarMotoristasUseCase(repositorioMotorista)

  // Use cases - Utilizacao
  const iniciarUtilizacao = new IniciarUtilizacaoUseCase(
    repositorioAutomovel, repositorioMotorista,
    repositorioUtilizacao, servicoDominioUtilizacao
  )
  const finalizarUtilizacao = new FinalizarUtilizacaoUseCase(
    repositorioUtilizacao, repositorioAutomovel, repositorioMotorista
  )
  const listarUtilizacoes = new ListarUtilizacoesUseCase(
    repositorioUtilizacao, repositorioAutomovel, repositorioMotorista
  )

  // Controllers
  const controladorAuth = new AuthController(loginUseCase)
  const controladorAutomovel = new AutomovelController(
    criarAutomovel, atualizarAutomovel, excluirAutomovel,
    obterAutomovel, listarAutomoveis
  )
  const controladorMotorista = new MotoristaController(
    criarMotorista, atualizarMotorista, excluirMotorista,
    obterMotorista, listarMotoristas
  )
  const controladorUtilizacao = new UtilizacaoController(
    iniciarUtilizacao, finalizarUtilizacao, listarUtilizacoes
  )

  // Routes
  rotas.use('/api', criarRotasDocs())
  rotas.use('/api', criarRotasAuth(controladorAuth))
  rotas.use('/api', criarRotasAutomovel(controladorAutomovel))
  rotas.use('/api', criarRotasMotorista(controladorMotorista))
  rotas.use('/api', criarRotasUtilizacao(controladorUtilizacao))

  return rotas
}
