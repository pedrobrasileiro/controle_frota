import { Motorista } from '../../domain/entity/motorista.entity'
import { IMotoristaDataSource } from './imotorista_datasource'

export class MotoristaEmMemoriaDataSource implements IMotoristaDataSource {
  private motoristas: Motorista[] = []

  salvar(motorista: Motorista): Motorista {
    this.motoristas.push(motorista)
    return motorista
  }

  atualizar(motorista: Motorista): Motorista {
    const index = this.motoristas.findIndex((m) => m.id === motorista.id)
    if (index !== -1) {
      this.motoristas[index] = motorista
    }
    return motorista
  }

  excluir(id: string): void {
    this.motoristas = this.motoristas.filter((m) => m.id !== id)
  }

  obterPorId(id: string): Motorista | null {
    return this.motoristas.find((m) => m.id === id) ?? null
  }

  obterPorNome(nome: string): Motorista | null {
    return this.motoristas.find((m) => m.nome === nome) ?? null
  }

  listar(filtros?: { nome?: string }): Motorista[] {
    let resultado = this.motoristas
    if (filtros?.nome) {
      resultado = resultado.filter((m) => m.nome.toLowerCase().includes(filtros.nome!.toLowerCase()))
    }
    return resultado
  }
}
