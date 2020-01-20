import { useMediaQuery } from 'react-responsive';
import { size } from '@web/styles/constants/size';
import React from 'react';
import { Segment } from 'semantic-ui-react';

export const SwLaptop = ({ children }) => {
	const isDesktop = useMediaQuery({ minWidth: size.laptop });
	return isDesktop ? children : null;
};
export const SwTablet = ({ children }) => {
	const isTablet = useMediaQuery({ minWidth: size.tablet, maxWidth: size.laptop - 1 });
	return isTablet ? children : null;
};

export const SwBigScreen = ({ children }) => {
	const isBigScreen = useMediaQuery({ minWidth: size.tablet });
	return isBigScreen ? children : null;
};

export const SwMobile = ({ children }) => {
	const isMobile = useMediaQuery({ maxWidth: size.tablet - 1 });
	return isMobile ? children : null;
};

export const SwMobileL = ({ children }) => {
	const isMobile = useMediaQuery({ minWidth: size.mobileL, maxWidth: size.tablet - 1 });
	return isMobile ? children : null;
};

export const SwMobileM = ({ children }) => {
	const isMobile = useMediaQuery({ minWidth: size.mobileM, maxWidth: size.mobileL - 1 });
	return isMobile ? children : null;
};

export const SwMobileS = ({ children }) => {
	const isMobile = useMediaQuery({ minWidth: size.mobileS, maxWidth: size.mobileM - 1 });
	return isMobile ? children : null;
};

export const SwResponsiveSegment = ({ children, className }) => {
	const isBigScreen = useMediaQuery({ minWidth: size.tablet });
	return isBigScreen ? (
		<Segment className={className}>{children}</Segment>
	) : (
		<div className={className}>{children}</div>
	);
};
