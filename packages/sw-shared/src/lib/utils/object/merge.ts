import { mergeWith } from 'lodash';

function mergeArrayCustomizer(objValue, srcValue) {
	if (Array.isArray(objValue)) {
		return objValue.concat(srcValue);
	}
}

export function mergeConcatArray(...sources) {
	//@ts-ignore
	return mergeWith(...sources, mergeArrayCustomizer);
}
