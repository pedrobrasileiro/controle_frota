import Joi from 'joi'

export const iniciarUtilizacaoSchema = Joi.object({
  automovelId: Joi.string().uuid().required(),
  motoristaId: Joi.string().uuid().required(),
  motivo: Joi.string().min(3).required(),
})

export const finalizarUtilizacaoSchema = Joi.object({
  dataTermino: Joi.string().isoDate(),
})

export const listarUtilizacoesSchema = Joi.object({
  apenasAbertas: Joi.boolean(),
})
