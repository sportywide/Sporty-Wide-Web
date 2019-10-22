DROP INDEX idx_team_tsv;
DROP INDEX idx_player_tsv;
ALTER TABLE team DROP COLUMN tsv;
ALTER TABLE player DROP COLUMN tsv;
DROP TRIGGER player_tsvector_update ON player cascade;
DROP TRIGGER team_tsvector_update ON team cascade;
DROP FUNCTION team_search_trigger() cascade;
DROP FUNCTION player_search_trigger() cascade;
DROP INDEX idx_player_name;
DROP INDEX idx_team_title;