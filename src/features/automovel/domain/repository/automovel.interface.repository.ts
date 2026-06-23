import { Automovel } from '../entity/automovel.entity'

export interface IAutomovelRepository {
  salvar(automovel: Automovel): Promise<Automovel>
  atualizar(automovel: Automovel): Promise<Automovel>
  excluir(id: string): Promise<void>
  obterPorId(id: string): Promise<Automovel | null>
  listar(filtros?: { cor?: string; marca?: string }): Promise<Automovel[]>
}
