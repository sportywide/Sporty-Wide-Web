export const formationMap = {
	'4-4-2': require('@shared/lib/strategy/4-4-2.json'),
	'4-3-3': require('@shared/lib/strategy/4-3-3.json'),
};
export type FormationName = keyof typeof formationMap;

export class FormationDto {
	name: string;
	formation: PositionDto[];
}

export class PositionDto {
	name: string;
	top: number;
	left: number;
}
