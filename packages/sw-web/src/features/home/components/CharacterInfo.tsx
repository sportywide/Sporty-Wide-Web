import React, { useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UserContext } from '@web/shared/lib/store';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { IHomeState } from '../store/reducers/';

const SwCharacterInfo = ({ character, error, isFetchedOnServer = false }: IHomeState) => {
	if (!character) {
		return <div>Loading</div>;
	}
	const user: IUser = useContext(UserContext);
	return (
		<div className="CharacterInfo">
			{error ? (
				<p>We encountered and error.</p>
			) : (
				<article>
					<h3>Character: {character.name}</h3>
					<p> url: {character.url} </p>
					<p>birth year: {character.birth_year}</p>
					<p>gender: {character.gender}</p>
					<p>skin color: {character.skin_color}</p>
					<p>eye color: {character.eye_color}</p>
					<p>user: {user.name}</p>
				</article>
			)}
			<p>
				( was character fetched on server? - <b>{isFetchedOnServer.toString()} )</b>
			</p>
			<style jsx>{`
				article {
					background-color: #528ce0;
					border-radius: 15px;
					padding: 15px;
					width: 250px;
					margin: 15px 0;
					color: white;
				}
				button {
					margin-right: 10px;
				}
			`}</style>
		</div>
	);
};

SwCharacterInfo.propTypes = {
	character: PropTypes.object,
	error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	isFetchedOnServer: PropTypes.bool,
};

export default connect(({ home }: { home: IHomeState }) => home)(SwCharacterInfo);
