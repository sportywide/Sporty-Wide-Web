import '@testing-library/jest-dom/extend-expect';
import { TestScheduler } from 'rxjs/testing';
import { Container } from 'typedi';

export const deepEquals = (actual, expected) => expect(actual).toEqual(expected);

export const createTestScheduler = () => new TestScheduler(deepEquals);

export const newContainer = (containerId?: any) => {
	return Container.of(containerId || Symbol('Testing'));
};
