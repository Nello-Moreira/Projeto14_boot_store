import Joi from 'joi';

const sessionSchema = Joi.object({
	userId: Joi.string().guid({ version: ['uuidv4'] }),
	token: Joi.string().guid({ version: ['uuidv4'] }),
});

export default sessionSchema;
