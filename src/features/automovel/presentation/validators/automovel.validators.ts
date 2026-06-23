import Joi from 'joi'

export const criarAutomovelSchema = Joi.object({
  placa: Joi.string().pattern(/^[A-Z]{3}-\d{4}$/).required(),
  cor: Joi.string().min(2).required(),
  marca: Joi.string().min(2).required(),
})

export const atualizarAutomovelSchema = Joi.object({
  placa: Joi.string().pattern(/^[A-Z]{3}-\d{4}$/),
  cor: Joi.string().min(2),
  marca: Joi.string().min(2),
}).min(1)

export const listarAutomoveisSchema = Joi.object({
  cor: Joi.string().min(3),
  marca: Joi.string().min(3),
})
