ALTER TABLE fixture DROP COLUMN fixture_number;
ALTER TABLE fixture ADD COLUMN home_fixture int2;
ALTER TABLE fixture ADD COLUMN away_fixture int2;