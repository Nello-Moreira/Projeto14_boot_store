import Joi from 'joi';

const categoryNameSchema = Joi.object({
	categoryName: Joi.string().alphanum().min(1).required(),
});

export default categoryNameSchema;
