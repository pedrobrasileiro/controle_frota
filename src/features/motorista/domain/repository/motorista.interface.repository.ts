import { Motorista } from '../entity/motorista.entity'

export interface IMotoristaRepository {
  salvar(motorista: Motorista): Promise<Motorista>
  atualizar(motorista: Motorista): Promise<Motorista>
  excluir(id: string): Promise<void>
  obterPorId(id: string): Promise<Motorista | null>
  obterPorNome(nome: string): Promise<Motorista | null>
  listar(filtros?: { nome?: string }): Promise<Motorista[]>
}
