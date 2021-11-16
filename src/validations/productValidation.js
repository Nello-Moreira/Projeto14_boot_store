import Joi from 'joi';

const schema = Joi.object({
	uuid: Joi.string()
		.guid({ version: ['uuidv4'] })
		.required(),
	quantity: Joi.number().integer().positive().min(1).required(),
});

function validateProduct(product) {
	return schema.validate(product);
}

export default validateProduct;
