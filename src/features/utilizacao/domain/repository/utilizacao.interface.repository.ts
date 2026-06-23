import { Utilizacao } from '../entity/utilizacao.entity'

export interface IUtilizacaoRepository {
  salvar(utilizacao: Utilizacao): Promise<Utilizacao>
  atualizar(utilizacao: Utilizacao): Promise<Utilizacao>
  obterPorId(id: string): Promise<Utilizacao | null>
  listar(): Promise<Utilizacao[]>
  obterUtilizacaoAtivaPorAutomovel(automovelId: string): Promise<Utilizacao | null>
  obterUtilizacaoAtivaPorMotorista(motoristaId: string): Promise<Utilizacao | null>
}
