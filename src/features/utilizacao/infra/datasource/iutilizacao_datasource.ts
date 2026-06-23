import { Utilizacao } from '../../domain/entity/utilizacao.entity'

export interface IUtilizacaoDataSource {
  salvar(utilizacao: Utilizacao): Utilizacao
  atualizar(utilizacao: Utilizacao): Utilizacao
  obterPorId(id: string): Utilizacao | null
  listar(filtros?: { apenasAbertas?: boolean }): Utilizacao[]
  obterPorAutomovelId(automovelId: string): Utilizacao[]
  obterPorMotoristaId(motoristaId: string): Utilizacao[]
}
