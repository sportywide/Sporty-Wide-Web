import { ContainerInstance } from 'typedi';

interface SwType {
	container: ContainerInstance;
}
export const Sw: SwType = {
	container: null as any,
};
