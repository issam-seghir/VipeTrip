const normalize = (schema) => {
	const { toJSON, normalizeId = true, removeVersion = true, removePrivatePaths = true, toJSON: { transform } = {} } = schema.options;

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
				ret.id = ret._id.toString();
				delete ret._id;
			}

			// apply the transformation to each sub-document
			for (let prop in ret) {
				if (Array.isArray(ret[prop])) {
					ret[prop].forEach((item) => {
						if (item._id) {
							item.id = item._id.toString();
							delete item._id;
						}
						if (item.__v) delete item.__v;
					});
				} else if (ret[prop] instanceof Object && ret[prop]._id) {
					ret[prop].id = ret[prop]._id.toString();
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
