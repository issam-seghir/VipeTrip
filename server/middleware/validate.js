// source : https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p

/* usage :
const { z } = require('zod');
const { validate } = require('./middleware/validate');
const { dataSchema } = require('./validations/registerValidation');

app.post('/register', validate(dataSchema), async (req, res) => {
    // do something
});
*/


const validate = (schema) => async (req, res, next) => {
	try {
		await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
		});
		return next();
	} catch (error) {
		return res.status(400).json(error);
	}
};
