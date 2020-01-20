import dynamoose from 'dynamoose-improved';
import { isDevelopment } from '@shared/lib/utils/env';

dynamoose.AWS.config.update({
	region: 'ap-southeast-2',
});

dynamoose.setDefaults({
	create: false,
});

if (isDevelopment()) {
	dynamoose.local('http://localhost:7000');
}

export default dynamoose;
