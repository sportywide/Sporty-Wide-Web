import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeagueTable } from '@schema/league/models/league-table.schema';

@Injectable()
export class LeagueResultService {
	constructor(@InjectModel('LeagueTable') private readonly leagueTableModel: Model<LeagueTable>) {}

	async save(leagueTableDto): Promise<LeagueTable> {
		return this.leagueTableModel.updateOne(
			{
				leagueId: leagueTableDto.leagueId,
			},
			leagueTableDto,
			{
				upsert: true,
			}
		);
	}

	async find({ leagueId }): Promise<LeagueTable | null> {
		return await this.leagueTableModel
			.findOne({
				leagueId,
			})
			.exec();
	}
}
