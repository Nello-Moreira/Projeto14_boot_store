import Joi from 'joi';

const schema = Joi.object({
	uuid: Joi.string().guid({ version: ['uuidv4'] }),
});

function validateUuid(uuid) {
	return schema.validate({ uuid });
}

export default validateUuid;
