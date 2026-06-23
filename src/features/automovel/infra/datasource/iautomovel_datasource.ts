import { Automovel } from '../../domain/entity/automovel.entity'

export interface IAutomovelDataSource {
  salvar(automovel: Automovel): Automovel
  atualizar(automovel: Automovel): Automovel
  excluir(id: string): void
  obterPorId(id: string): Automovel | null
  listar(filtros?: { cor?: string; marca?: string }): Automovel[]
}
