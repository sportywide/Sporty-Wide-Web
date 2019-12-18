export function toCron(date: Date) {
	return `cron(${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()}) ${date.getUTCMonth() +
		1} ? ${date.getUTCFullYear()}`;
}
