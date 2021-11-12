import bcrypt from 'bcrypt';

function hashPassword(password) {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hashedPassword) {
	return bcrypt.compareSync(password, hashedPassword);
}

export { hashPassword, comparePassword };
