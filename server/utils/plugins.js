const mongoose = require("mongoose");
const log = require("@/utils/chalkLogger");

const normalize = (schema) => {
	const {
		toJSON,
		normalizeId = true,
		removeVersion = true,
		removePrivatePaths = true,
		toJSON: { transform } = {},
	} = schema.options;

	const json = {
		virtuals: true,
		versionKey: false,
		transform(doc, ret, options) {
			if (removePrivatePaths) {
				const { paths } = schema;
				for (const path in paths) {
					if (paths[path].options && paths[path].options.private && ret[path]) {
						delete ret[path];
					}
				}
			}

			if (removeVersion && ret.__v) {
				delete ret.__v;
			}

			if (normalizeId && ret._id) {
				try {
					ret.id = ret._id.toHexString();
				} catch (error) {
					console.log("ret.id is Valid mongoose ObjectId :", mongoose.isValidObjectId(ret.id));
					log.error("normalize plugin : Error converting ObjectId to string: \n");
					console.error(error);
				}
				delete ret._id;
			}

			// apply the transformation to each sub-document
			for (let prop in ret) {
				if (Array.isArray(ret[prop]) && (ret[prop]?._id?.toHexString()) ){
					ret[prop].forEach((item) => {
						if (item?._id) {
							try {
								ret.id = ret._id.toHexString();
							} catch (error) {
								console.log("ret.id is Valid mongoose ObjectId :", mongoose.isValidObjectId(ret.id));
								log.error("normalize plugin : Error converting ObjectId to string: \n");
								console.error(error);
							}
							delete item._id;
						}
						if (item.__v) delete item.__v;
					});
				} else if (ret[prop] instanceof Object && ret[prop]?._id) {
					try {
						console.log(ret[prop]);
						console.log("ret[prop]._id", ret[prop]._id);
						console.log("ret[prop].id", ret[prop].id);
						console.log("ret[prop].id is Valid mongoose ObjectId :", mongoose.isValidObjectId(ret.id));
						ret[prop].id = Buffer.from(ret[prop]._id.toString(), "hex");
					} catch (error) {
						log.error("normalize plugin : Error converting ObjectId to string: \n");
						console.error(error);
					}
					delete ret[prop]._id;
					if (ret[prop].__v) delete ret[prop].__v;
				}
			}

			if (transform) {
				return transform(doc, ret, options);
			}
		},
	};

	schema.options.toJSON = { ...toJSON, ...json };
};

module.exports = { normalize };
