import { Utilizacao } from '../../domain/entity/utilizacao.entity'
import { IUtilizacaoDataSource } from './iutilizacao_datasource'

export class UtilizacaoEmMemoriaDataSource implements IUtilizacaoDataSource {
  private utilizacoes: Utilizacao[] = []

  salvar(utilizacao: Utilizacao): Utilizacao {
    this.utilizacoes.push(utilizacao)
    return utilizacao
  }

  atualizar(utilizacao: Utilizacao): Utilizacao {
    const index = this.utilizacoes.findIndex((u) => u.id === utilizacao.id)
    if (index !== -1) {
      this.utilizacoes[index] = utilizacao
    }
    return utilizacao
  }

  obterPorId(id: string): Utilizacao | null {
    return this.utilizacoes.find((u) => u.id === id) ?? null
  }

  listar(): Utilizacao[] {
    return [...this.utilizacoes]
  }

  obterPorAutomovelId(automovelId: string): Utilizacao[] {
    return this.utilizacoes.filter((u) => u.automovelId === automovelId)
  }

  obterPorMotoristaId(motoristaId: string): Utilizacao[] {
    return this.utilizacoes.filter((u) => u.motoristaId === motoristaId)
  }
}
