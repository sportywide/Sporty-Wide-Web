CREATE OR REPLACE FUNCTION day_of_week(date TIMESTAMP WITH TIME ZONE)
  RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT mod((date_part('DOW', date) + 6) :: NUMERIC, 7) + 1);
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION select_next_interval(date TIMESTAMP WITH TIME ZONE)
  RETURNS TIMESTAMP AS $$
BEGIN
  RETURN (SELECT date_trunc('day', date_trunc('week', date + INTERVAL '1 week')));
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION select_next_match(team_id NUMERIC)
  RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT fixture.id
               FROM fixture
               WHERE fixture.status != 'FT' AND
                     fixture.time < select_next_interval(NOW())
                     AND fixture.time >= date_trunc('week', NOW())
                     AND (fixture.home_id = team_id
                     OR fixture.away_id = team_id)
               LIMIT 1);
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION select_match_week(team_id NUMERIC)
  RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT fixture.id
               FROM fixture
               WHERE fixture.time < select_next_interval(NOW())
                     AND fixture.time >= date_trunc('week', NOW())
                     AND (fixture.home_id = team_id
                     OR fixture.away_id = team_id)
               LIMIT 1);
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION field(ANYELEMENT, ANYARRAY)
  RETURNS BIGINT AS $$
SELECT n
FROM (
       SELECT
         row_number()
         OVER () AS n,
         x
       FROM unnest($2) x
     ) numbered
WHERE numbered.x = $1
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION select_rating(real_rating NUMERIC, betting player_betting)
  RETURNS INTEGER AS $$
DECLARE
    rating_diff INTEGER := abs(real_rating - betting.bet_rating);
	diff_factor NUMERIC := 0;
BEGIN
  IF rating_diff <= 0.5 THEN
  	diff_factor := 2;
  ELSIF rating_diff <= 0.75 THEN
  	diff_factor := 1.5;
  ELSIF rating_diff <= 1 THEN
  	diff_factor := 1.25;
  ELSIF rating_diff <= 1.25 THEN
  	diff_factor := 1;
  ELSIF rating_diff <= 1.5 THEN
  	diff_factor := 0.75;
  ELSIF rating_diff <= 1.75 THEN
  	diff_factor := 0.5;
  ELSIF rating_diff <= 2 THEN
  	diff_factor := 0.3;
  END IF;
  RETURN diff_factor * betting.bet_tokens;
END;$$
LANGUAGE 'plpgsql';
