import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Segment } from 'semantic-ui-react';

const USER_QUERIES = gql`
	{
		users {
			id
			firstName
			lastName
		}
	}
`;

const GraphQlTestComponent: React.FC<any> = () => {
	const { loading, error, data } = useQuery(USER_QUERIES);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return data.users.map(({ id, firstName, lastName }) => (
		<Segment key={id}>
			<div>Id: {id}</div>
			<div>First name: {firstName}</div>
			<div>Last name: {lastName}</div>
		</Segment>
	));
};

export const GraphQlTest = GraphQlTestComponent;
