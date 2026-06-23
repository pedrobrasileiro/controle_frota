export interface Utilizacao {
  id: string
  automovelId: string
  motoristaId: string
  dataInicio: Date
  dataTermino: Date | null
  motivo: string
  criadoEm: Date
}

export interface UtilizacaoCompletaDTO {
  id: string
  dataInicio: Date
  dataTermino: Date | null
  motivo: string
  motorista: {
    id: string
    nome: string
  }
  automovel: {
    id: string
    placa: string
    cor: string
    marca: string
  }
}
