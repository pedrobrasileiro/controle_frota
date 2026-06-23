import { Motorista } from '../../domain/entity/motorista.entity'

export interface IMotoristaDataSource {
  salvar(motorista: Motorista): Motorista
  atualizar(motorista: Motorista): Motorista
  excluir(id: string): void
  obterPorId(id: string): Motorista | null
  listar(filtros?: { nome?: string }): Motorista[]
}
