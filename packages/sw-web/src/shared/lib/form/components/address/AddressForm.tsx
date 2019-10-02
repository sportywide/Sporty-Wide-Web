import React, { useState, useCallback } from 'react';
import { getFormikValue, SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPlaceAutoCompleteField } from '@web/shared/lib/form/components/address/PlaceAutoCompleteField';
import { SwCitySelect } from '@web/features/address/components/CitySelect';
import { SwStateSelect } from '@web/features/address/components/StateSelect';
import { SwCountrySelect } from '@web/features/address/components/CountrySelect';
import { Form } from 'semantic-ui-react';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
import { noop } from '@shared/lib/utils/functions';
import { connect, FormikContext } from 'formik';

interface IProps {
	name?: string;
	onToggleAutoCompleteField?: (isShowingAutoComplete: boolean) => void;
	isShowingAutoComplete?: boolean;
	didSelectAddress?: (address: AddressDto) => void;
}

const SwAddressFormComponent: React.FC<IProps> = ({
	name = 'address',
	onToggleAutoCompleteField = noop,
	didSelectAddress = noop,
	isShowingAutoComplete,
	...otherProps
}) => {
	const formik: FormikContext<any> = (otherProps as any).formik;
	const [countryId, setCountryId] = useState<number | null | undefined>(undefined);
	const [stateId, setStateId] = useState<number | null | undefined>(undefined);
	const onCountryChangeCallback = useCallback(onCountryChange, []);
	const onCountrySetCallback = useCallback(onCountrySet, []);
	const onStateChangeCallback = useCallback(onStateChange, []);
	const onStateSetCallback = useCallback(onStateSet, []);
	const onCityChangeCallback = useCallback(onCityChange, []);

	return (
		<>
			<div className={'sw-mb1'}>
				<a
					onClick={() => {
						setCountryId(null);
						setStateId(null);
						onToggleAutoCompleteField(!isShowingAutoComplete);
					}}
				>
					{isShowingAutoComplete ? 'Enter address manually' : 'Look up address'}
				</a>
			</div>
			{isShowingAutoComplete && <SwPlaceAutoCompleteField onAddressSelected={setAddress} />}
			{!isShowingAutoComplete && (
				<>
					<SwFormField
						component={Form.Input}
						componentProps={{
							label: 'Address 1',
							placeholder: 'Address 1',
						}}
						name={`${name}.street1`}
					/>
					<SwFormField
						component={Form.Input}
						componentProps={{
							label: 'Address 2',
							placeholder: 'Address 2',
						}}
						name={`${name}.street2`}
					/>
					<Form.Group widths="equal">
						<SwFormField
							name={`${name}.suburb`}
							component={Form.Input}
							componentProps={{
								label: 'Suburb',
								placeholder: 'Your suburb',
							}}
						/>
						<SwFormField
							name={`${name}.postcode`}
							component={Form.Input}
							componentProps={{
								label: 'Postcode',
								placeholder: 'Your postcode',
							}}
						/>
					</Form.Group>
					<Form.Group widths="equal">
						{stateId !== undefined && (
							<SwCitySelect
								value={getFormikValue(formik, `${name}.city`)}
								label={'City'}
								placeholder={'Your City'}
								stateId={stateId}
								onCityChange={onCityChangeCallback}
							/>
						)}

						{countryId !== undefined && (
							<SwStateSelect
								value={getFormikValue(formik, `${name}.state`)}
								label={'State'}
								placeholder={'Your State'}
								countryId={countryId}
								onStateChange={onStateChangeCallback}
								onStateLoaded={onStateSetCallback}
							/>
						)}

						<SwCountrySelect
							value={getFormikValue(formik, `${name}.country`)}
							label={'Country'}
							placeholder={'Your country'}
							onCountryChange={onCountryChangeCallback}
							onCountryLoaded={onCountrySetCallback}
						/>
					</Form.Group>
				</>
			)}
		</>
	);

	function onCountryChange(country) {
		formik.setFieldValue(`${name}.state`, '');
		formik.setFieldValue(`${name}.city`, '');
		formik.setFieldValue(`${name}.country`, (country && country.name) || '');
		setCountryId(country && country.id);
		setStateId(null);
	}

	function onCountrySet(country) {
		setCountryId(country && country.id);
		formik.setFieldValue(`${name}.country`, (country && country.name) || '');
	}

	function onStateChange(state) {
		formik.setFieldValue(`${name}.city`, '');
		formik.setFieldValue(`${name}.state`, state && state.name);
		setStateId(state && state.id);
	}

	function onStateSet(state) {
		setStateId(state && state.id);
		formik.setFieldValue(`${name}.state`, (state && state.name) || '');
	}

	function onCityChange(city) {
		formik.setFieldValue(`${name}.city`, city && city.name);
	}

	function setAddress(address: AddressDto) {
		Object.keys(address).forEach(key => {
			//@ts-ignore
			formik.setFieldValue(`${name}.${key}`, address[key], true);
		});
		didSelectAddress(address);
	}
};

export const SwAddressForm = connect(SwAddressFormComponent);
