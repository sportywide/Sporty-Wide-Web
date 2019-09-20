export class FormationDto {
	name: string;
	formation: PositionDto[];
}

export class PositionDto {
	name: string;
	top: number;
	left: number;
}
