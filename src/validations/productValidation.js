import Joi from 'joi';

const schema = Joi.object({
	cart_id: Joi.number().integer().required(),
	products_id: Joi.number().integer().required(),
	product_quantity: Joi.number().integer().required(),
	product_price: Joi.number().positive().required(),
	removed_at: Joi.date().allow(null),
});

function validateProduct(product) {
	return schema.validate(product);
}

export default validateProduct;
