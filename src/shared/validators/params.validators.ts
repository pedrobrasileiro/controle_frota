import Joi from 'joi'

export const paramsIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
})
