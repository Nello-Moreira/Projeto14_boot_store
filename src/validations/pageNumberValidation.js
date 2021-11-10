import Joi from 'joi';

const pageSchema = Joi.object({
	page: Joi.number().integer().min(1),
});

export default pageSchema;
