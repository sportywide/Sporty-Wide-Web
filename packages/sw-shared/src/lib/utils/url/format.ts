import url from 'url';

export function getFullPath(req, path = '', { protocol = '' } = {}) {
	return url.format({
		protocol: protocol || req.protocol,
		host: req.get('host'),
		pathname: path,
	});
}

export function normalizePath(path, prefix) {
	return path.replace(new RegExp(`^\\/${prefix}`), '').replace(/\/$/, '');
}
