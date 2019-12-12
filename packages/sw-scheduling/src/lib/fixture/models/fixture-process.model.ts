import dynamoose from '@scheduling/lib/aws/dynamoose';

export enum FixtureProcessStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	SUCCESS = 'success',
	FAILED = 'failed',
	RETRY = 'retry',
}

export type FixtureProcess = {
	matchUrl: string;
	matchId: number;
	attempt: number;
	status: FixtureProcessStatus;
	nextTime: Date;
};

export const FixtureProcessModel = dynamoose.model<FixtureProcess, { matchUrl: string }>('fixture-process', {
	matchUrl: {
		type: String,
		hash: true,
	},
	matchId: {
		type: Number,
	},
	attempt: {
		type: Number,
	},
	status: {
		type: String,
	},
	nextTime: {
		type: Date,
	},
});
