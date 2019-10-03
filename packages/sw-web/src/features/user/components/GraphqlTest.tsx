import React from 'react';
import { Segment, SegmentGroup } from 'semantic-ui-react';
import { useGetUsersQuery } from '@web/graphql-generated';

const GraphQlTestComponent: React.FC<any> = () => {
	const { loading, error, data } = useGetUsersQuery({
		variables: {
			limit: 10,
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<SegmentGroup>
			{data.users.map(({ id, firstName, lastName }) => (
				<Segment key={id}>
					<div>Id: {id}</div>
					<div>First name: {firstName}</div>
					<div>Last name: {lastName}</div>
				</Segment>
			))}
		</SegmentGroup>
	);
};

export const GraphQlTest = GraphQlTestComponent;
