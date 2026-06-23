import Joi from 'joi'

export const loginSchema = Joi.object({
  usuario: Joi.string().required(),
  senha: Joi.string().min(6).required(),
})
