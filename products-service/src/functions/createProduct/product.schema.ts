import * as Joi from "joi";

export const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().min(0).required(),
});
