import React, { useState } from 'react';
import { FormFieldProps, SwFormField } from '@web/shared/lib/form/components/FormField';
import { Form, Progress } from 'semantic-ui-react';
import zxcvbn from 'zxcvbn';

export type PasswordFieldProps = Omit<FormFieldProps, 'component'>;

export const SwPasswordField: React.FC<PasswordFieldProps> = ({ componentProps, onChange, ...props }) => {
	const [score, setScore] = useState(0);
	const [password, setPassword] = useState('');
	const [feedback, setFeedback] = useState<any>({});
	return (
		<div className={'ub-flex ub-flex-column '}>
			<SwFormField
				componentProps={{ ...componentProps, type: 'password' }}
				component={Form.Input}
				onChange={handlePasswordChange}
				value={password}
				{...props}
			/>
			<Progress
				color={getColor(score)}
				style={{ 'margin-bottom': '5px' }}
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

	function handlePasswordChange(e, params) {
		const { value } = params;
		const { score, feedback } = zxcvbn(value);
		setScore(score);
		setFeedback(feedback);
		setPassword(value);
		if (onChange) {
			onChange(e, params);
		}
	}

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
