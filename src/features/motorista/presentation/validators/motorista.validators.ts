import Joi from 'joi'

export const criarMotoristaSchema = Joi.object({
  nome: Joi.string().min(2).required(),
})

export const atualizarMotoristaSchema = Joi.object({
  nome: Joi.string().min(2),
}).min(1)

export const listarMotoristasSchema = Joi.object({
  nome: Joi.string().min(3),
})
