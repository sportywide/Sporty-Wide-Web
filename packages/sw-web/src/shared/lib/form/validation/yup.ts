import { Schema, reach } from 'yup';

export function modifySchema(schema: Schema<any>, mutations) {
	const clonedSchema = schema.clone();
	Object.keys(mutations).forEach(key => {
		const nestedSchema = reach(schema, key);
		nestedSchema.withMutation(mutations[key]);
	});
	return clonedSchema;
}
