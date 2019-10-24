CREATE OR REPLACE FUNCTION day_of_week(date TIMESTAMP WITH TIME ZONE)
  RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT mod((date_part('DOW', date) + 6) :: NUMERIC, 7) + 1);
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION select_next_interval(date TIMESTAMP WITH TIME ZONE)
  RETURNS TIMESTAMP AS $$
BEGIN
  RETURN (SELECT CASE WHEN day_of_week(date) <= 5
    THEN
      date_trunc('week', date + INTERVAL '1 week') + INTERVAL '4 DAY'
                 ELSE date_trunc('week', date + INTERVAL '2 week') + INTERVAL '4 DAY' END);
END;$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION select_next_match(team_id NUMERIC)
  RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT fixture.id
               FROM fixture
               WHERE fixture.status = 'PENDING' AND
                     fixture.time <= select_next_interval(NOW())
                     AND (fixture.home_id = 11 OR fixture.away_id = 11)
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