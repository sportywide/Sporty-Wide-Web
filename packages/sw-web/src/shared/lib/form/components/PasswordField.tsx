import React, { useState, useCallback } from 'react';
import { FormFieldProps, SwFormField } from '@web/shared/lib/form/components/FormField';
import { Form, Icon, Progress } from 'semantic-ui-react';

export type PasswordFieldProps = Omit<FormFieldProps<any>, 'component'> & {
	className?: string;
};

export const SwPasswordField: React.FC<PasswordFieldProps> = ({
	className = '',
	componentProps,
	onChange,
	children,
	...props
}) => {
	const [score, setScore] = useState(0);
	const [password, setPassword] = useState('');
	const [feedback, setFeedback] = useState<any>({});
	const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
	const handlePasswordChange = useCallback(
		async (value = '') => {
			setPassword(value);
			const { default: zxcvbn } = await import(/* webpackChunkName: "zxcvbn" */ 'zxcvbn/dist/zxcvbn.js');
			const { score, feedback } = zxcvbn(value);
			setScore(score);
			setFeedback(feedback);
		},
		[setPassword, setFeedback, setScore]
	);
	return (
		<div className={`ub-flex ub-flex-column ${className}`}>
			<SwFormField
				componentProps={{
					...componentProps,
					type: isShowingPassword ? 'text' : 'password',
					icon: (
						<Icon
							onClick={() => setIsShowingPassword(!isShowingPassword)}
							name={isShowingPassword ? 'eye' : 'eye slash'}
							link
						/>
					),
				}}
				component={Form.Input}
				onValueChange={handlePasswordChange}
				onChange={onChange}
				{...props}
			>
				{children}
			</SwFormField>
			<Progress
				color={getColor(score)}
				style={{ marginBottom: '5px', marginTop: '10px' }}
				size={'tiny'}
				data-tooltip={feedback && feedback.warning ? feedback.warning : null}
				percent={password ? (Math.max(score, 1) * 100) / 4 : 0}
			/>
			{password && (
				<span className={'ub-right-align ub-bold'} style={{ color: getColor(score) }}>
					{getText(score)}
				</span>
			)}
		</div>
	);

	function getColor(score) {
		return {
			0: 'red',
			1: 'red',
			2: 'yellow',
			3: 'olive',
			4: 'green',
		}[score];
	}

	function getText(score) {
		return {
			0: 'Weak',
			1: 'Weak',
			2: 'So-so',
			3: 'Good',
			4: 'Great!',
		}[score];
	}
};
