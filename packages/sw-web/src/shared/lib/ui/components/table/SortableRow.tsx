import React, { ReactNode } from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { SwTableRow } from '@web/shared/lib/ui/components/table/Table';

interface IProps {
	children: ReactNode;
	column: string;
	asc: boolean;
	onChange?: (sortColumn: { column: string; asc: boolean }) => void;
}

const IconContainer = styled.span`
	position: relative;
	margin-left: 5px;
	display: inline-block;
	width: 10px;

	> i {
		position: relative;
	}
`;

const SwSortableRowComponent: React.FC<IProps> = ({ children, column, asc, onChange }) => {
	return (
		<SwTableRow>
			{React.Children.map(children, (child: any) => {
				return React.cloneElement(child, {
					children: (
						<span
							className={'sw-cursor-pointer sw-full-width sw-inline-block'}
							onClick={() => onChange(getNewSort({ column, asc, name: child.props.name }))}
						>
							{child.props.children} {renderArrow({ child, column, asc })}
						</span>
					),
				});
			})}
		</SwTableRow>
	);
};

function getNewSort({ column, name, asc }) {
	if (name === column) {
		return {
			column: asc !== false ? name : null,
			asc: asc !== false ? !asc : null,
		};
	} else {
		return {
			column: name,
			asc: true,
		};
	}
}

function renderArrow({ child, column: sortColumn, asc }) {
	if (!child.props.sortable) {
		return null;
	}

	if (child.props.name === sortColumn) {
		return (
			<IconContainer>
				{asc ? <Icon name={'caret up'} size={'small'} /> : <Icon name={'caret down'} size={'small'} />}
			</IconContainer>
		);
	}

	return (
		<IconContainer>
			<Icon style={{ top: '-3px', left: '0.5px' }} name={'caret up'} size={'small'} />
			<Icon style={{ bottom: '-2px', left: '-15.5px' }} name={'caret down'} size={'small'} />
		</IconContainer>
	);
}

export const SwSortableRow = SwSortableRowComponent;
