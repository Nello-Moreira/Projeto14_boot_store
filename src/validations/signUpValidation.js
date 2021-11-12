import Joi from 'joi';

const signUpSchema = Joi.object({
	name: Joi.string().min(1).required(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net', 'br'] },
		})
		.required(),
	password: Joi.string().min(1).required(),
	avatarUrl: Joi.string().pattern(
		/^((http:\/\/)|(https:\/\/)).+((jpg)|(jpeg)|(png))$/
	),
})
	.min(3)
	.max(4);

export default signUpSchema;
