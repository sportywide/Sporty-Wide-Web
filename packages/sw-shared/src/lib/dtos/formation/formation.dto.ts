export const formationMap = {
	'3-1-4-2': require('@shared/lib/strategy/3-1-4-2.json'),
	'3-4-1-2': require('@shared/lib/strategy/3-4-1-2.json'),
	'3-4-2-1': require('@shared/lib/strategy/3-4-2-1.json'),
	'3-4-3_flat': require('@shared/lib/strategy/3-4-3_flat.json'),
	'3-4-3-diamond': require('@shared/lib/strategy/3-4-3-diamond.json'),
	'3-4-3': require('@shared/lib/strategy/3-4-3.json'),
	'3-5-1-1': require('@shared/lib/strategy/3-5-1-1.json'),
	'3-5-2': require('@shared/lib/strategy/3-5-2.json'),
	'4-1-2-1-2_2': require('@shared/lib/strategy/4-1-2-1-2_2.json'),
	'4-1-2-1-2_narrow': require('@shared/lib/strategy/4-1-2-1-2_narrow.json'),
	'4-1-2-1-2_wide': require('@shared/lib/strategy/4-1-2-1-2_wide.json'),
	'4-1-2-1-2': require('@shared/lib/strategy/4-1-2-1-2.json'),
	'4-1-3-2': require('@shared/lib/strategy/4-1-3-2.json'),
	'4-1-4-1': require('@shared/lib/strategy/4-1-4-1.json'),
	'4-2-2-2': require('@shared/lib/strategy/4-2-2-2.json'),
	'4-2-3-1_2': require('@shared/lib/strategy/4-2-3-1_2.json'),
	'4-2-3-1_narrow': require('@shared/lib/strategy/4-2-3-1_narrow.json'),
	'4-2-3-1_wide': require('@shared/lib/strategy/4-2-3-1_wide.json'),
	'4-2-3-1': require('@shared/lib/strategy/4-2-3-1.json'),
	'4-2-4': require('@shared/lib/strategy/4-2-4.json'),
	'4-3-1-2': require('@shared/lib/strategy/4-3-1-2.json'),
	'4-3-2-1': require('@shared/lib/strategy/4-3-2-1.json'),
	'4-3-3_2': require('@shared/lib/strategy/4-3-3_2.json'),
	'4-3-3_3': require('@shared/lib/strategy/4-3-3_3.json'),
	'4-3-3_4': require('@shared/lib/strategy/4-3-3_4.json'),
	'4-3-3_5': require('@shared/lib/strategy/4-3-3_5.json'),
	'4-3-3_attack': require('@shared/lib/strategy/4-3-3_attack.json'),
	'4-3-3_defend': require('@shared/lib/strategy/4-3-3_defend.json'),
	'4-3-3_false_9': require('@shared/lib/strategy/4-3-3_false_9.json'),
	'4-3-3_flat': require('@shared/lib/strategy/4-3-3_flat.json'),
	'4-3-3_holding': require('@shared/lib/strategy/4-3-3_holding.json'),
	'4-3-3': require('@shared/lib/strategy/4-3-3.json'),
	'4-4-1-1_attack': require('@shared/lib/strategy/4-4-1-1_attack.json'),
	'4-4-1-1_midfield': require('@shared/lib/strategy/4-4-1-1_midfield.json'),
	'4-4-1-1': require('@shared/lib/strategy/4-4-1-1.json'),
	'4-4-2_2': require('@shared/lib/strategy/4-4-2_2.json'),
	'4-4-2_flat': require('@shared/lib/strategy/4-4-2_flat.json'),
	'4-4-2_holding': require('@shared/lib/strategy/4-4-2_holding.json'),
	'4-4-2': require('@shared/lib/strategy/4-4-2.json'),
	'4-5-1_2': require('@shared/lib/strategy/4-5-1_2.json'),
	'4-5-1_flat': require('@shared/lib/strategy/4-5-1_flat.json'),
	'4-5-1': require('@shared/lib/strategy/4-5-1.json'),
	'5-2-1-2': require('@shared/lib/strategy/5-2-1-2.json'),
	'5-2-2-1': require('@shared/lib/strategy/5-2-2-1.json'),
	'5-2-3': require('@shared/lib/strategy/5-2-3.json'),
	'5-3-2': require('@shared/lib/strategy/5-3-2.json'),
	'5-4-1_diamond': require('@shared/lib/strategy/5-4-1_diamond.json'),
	'5-4-1_flat': require('@shared/lib/strategy/5-4-1_flat.json'),
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
