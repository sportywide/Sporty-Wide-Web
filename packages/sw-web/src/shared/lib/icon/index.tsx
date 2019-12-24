import React from 'react';
import Footware from './images/footwear.svg';
import RedCard from './images/red-card.svg';
import YellowCard from './images/yellow-card.svg';
import SoccerBall from './images/soccer-ball.svg';

type IconSize = 'massive' | 'huge' | 'big' | 'large' | 'normal' | 'small' | 'tiny' | 'mini';
const componentMap = {
	'foot-ware': Footware,
	'red-card': RedCard,
	'yellow-card': YellowCard,
	'soccer-ball': SoccerBall,
};

export type IconName = keyof typeof componentMap;

export function SwIcon({
	size,
	name,
	...rest
}: {
	size?: IconSize;
	name: IconName;
	width?: number;
	height?: number;
	className?: string;
}) {
	let style = {};
	if (size) {
		style = { ...style, fontSize: getFontSize(size) };
	}
	const Component = componentMap[name];
	return <Component style={style} {...rest} />;
}

function getFontSize(size: IconSize) {
	switch (size) {
		case 'massive':
			return '8em';
		case 'huge':
			return '4em';
		case 'big':
			return '2em';
		case 'large':
			return '1.5em';
		case 'small':
			return '0.75';
		case 'tiny':
			return '0.5em';
		case 'mini':
			return '0.4em';
		default:
			return '1em';
	}
}
