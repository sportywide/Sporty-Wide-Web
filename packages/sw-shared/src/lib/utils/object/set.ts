import { setWith } from 'lodash';
export function setObjectKey(object, path, value) {
	setWith(object, path, value, Object);
}
