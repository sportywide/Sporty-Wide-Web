import fs from 'fs';
import * as nodePath from 'path';
import dotenv from 'dotenv';

const dotenvOverride = {
	config({ path = nodePath.resolve(process.cwd(), '.env') } = {}) {
		if (fs.existsSync(path)) {
			const envConfig = dotenv.parse(
				fs.readFileSync(path, {
					encoding: 'utf-8',
				})
			);
			for (const key of Object.keys(envConfig)) {
				process.env[key] = envConfig[key];
			}
		}
	},
};

module.exports = dotenvOverride;
