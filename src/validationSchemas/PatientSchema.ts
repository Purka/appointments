import Joi from 'joi';

export const PatientSchema = Joi.object({
    name: Joi.string().trim().required(),
    age: Joi.number().integer().min(0).required()
});