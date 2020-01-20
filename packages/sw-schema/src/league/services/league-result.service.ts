import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeagueTableDocument } from '@schema/league/models/league-table.schema';

@Injectable()
export class LeagueResultService {
	constructor(@InjectModel('LeagueTable') private readonly leagueTableModel: Model<LeagueTableDocument>) {}

	async save(leagueTableDto): Promise<LeagueTableDocument> {
		return this.leagueTableModel.updateOne(
			{
				leagueId: leagueTableDto.leagueId,
				season: leagueTableDto.season,
			},
			leagueTableDto,
			{
				upsert: true,
			}
		);
	}

	async find({ leagueId, season }): Promise<LeagueTableDocument | null> {
		return await this.leagueTableModel
			.findOne({
				leagueId,
				season,
			})
			.exec();
	}
}
