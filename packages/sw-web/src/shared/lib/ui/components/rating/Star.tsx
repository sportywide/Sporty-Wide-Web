import React, { useState } from 'react';
import { noop } from '@shared/lib/utils/functions';
import { range } from '@shared/lib/utils/array/range';
import * as S from './Star.styled';

interface IProps {
	maxStars?: number;
	value?: number;
	onChange?: (event, { value }: { value: number }) => void;
	readonly?: boolean;
}

const SwStarComponent: React.FC<IProps> = ({ maxStars = 5, value = 0, onChange = noop, readonly }) => {
	const [currentStars, setCurrentStar] = useState(value);
	return (
		<>
			<S.StarContainer onMouseLeave={() => onMouseLeave()}>
				{range(0, maxStars).map((star, index) => {
					return (
						<S.Star
							readonly={readonly}
							key={star}
							half={index + 1 > currentStars && index < currentStars}
							checked={index + 1 <= currentStars}
							onMouseMove={readonly ? null : event => onMouseMove(event, index)}
							onClick={readonly ? null : event => onMouseClick(event)}
						/>
					);
				})}
			</S.StarContainer>
		</>
	);

	function onMouseMove(e: React.MouseEvent, index) {
		if (isWithinFirstHalf(e)) {
			setCurrentStar(index + 1 - 0.5);
		} else {
			setCurrentStar(index + 1);
		}
	}

	function onMouseLeave() {
		setCurrentStar(value);
	}

	function onMouseClick(e) {
		onChange(e, { value: currentStars });
	}

	function isWithinFirstHalf(event: React.MouseEvent) {
		return event.nativeEvent.offsetX <= (event.currentTarget as any).offsetWidth / 2;
	}
};

export const SwStar = SwStarComponent;
