import React, { useState } from 'react';
import { Label } from 'semantic-ui-react';
import { useEffectOnce } from '@web/shared/lib/react/hooks';

interface IProps {
	onPageSizeChanged: (size: number) => void;
}
const SwPaginationOptionsComponent: React.FC<IProps> = ({ onPageSizeChanged }) => {
	const [pageSize, setPageSize] = useState(10);
	useEffectOnce(() => {
		onPageSizeChanged(pageSize);
	});
	return (
		<div className={'sw-flex sw-flex-center sw-mt3'}>
			<div className={'sw-flex-float-right'}>
				{[10, 25, 50, 100].map(size => (
					<Label
						className={'sw-center sw-min-width-40'}
						onClick={() => {
							setPageSize(size);
							onPageSizeChanged(size);
						}}
						basic={pageSize !== size}
						key={size}
						color={'blue'}
					>
						{size}
					</Label>
				))}
			</div>
		</div>
	);
};

export const SwPaginationOptions = SwPaginationOptionsComponent;
