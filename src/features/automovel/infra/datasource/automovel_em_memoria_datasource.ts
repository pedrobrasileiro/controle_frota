import { Automovel } from '../../domain/entity/automovel.entity'
import { IAutomovelDataSource } from './iautomovel_datasource'

export class AutomovelEmMemoriaDataSource implements IAutomovelDataSource {
  private automoveis: Automovel[] = []

  salvar(automovel: Automovel): Automovel {
    this.automoveis.push(automovel)
    return automovel
  }

  atualizar(automovel: Automovel): Automovel {
    const index = this.automoveis.findIndex((a) => a.id === automovel.id)
    if (index !== -1) {
      this.automoveis[index] = automovel
    }
    return automovel
  }

  excluir(id: string): void {
    this.automoveis = this.automoveis.filter((a) => a.id !== id)
  }

  obterPorId(id: string): Automovel | null {
    return this.automoveis.find((a) => a.id === id) ?? null
  }

  listar(filtros?: { cor?: string; marca?: string }): Automovel[] {
    let resultado = this.automoveis
    if (filtros?.cor) {
      resultado = resultado.filter((a) => a.cor === filtros.cor)
    }
    if (filtros?.marca) {
      resultado = resultado.filter((a) => a.marca === filtros.marca)
    }
    return resultado
  }
}
