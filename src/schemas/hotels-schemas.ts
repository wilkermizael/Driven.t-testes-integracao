import Joi from 'joi';

export const hotelId = Joi.object({
  hotelId: Joi.number().integer().greater(0),
});
