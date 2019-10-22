CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE team
    ADD COLUMN tsv tsvector;
CREATE INDEX idx_team_tsv ON team USING gin (tsv);
ALTER TABLE player
    ADD COLUMN tsv tsvector;
CREATE INDEX idx_player_tsv ON player USING gin (tsv);

CREATE FUNCTION team_search_trigger() RETURNS trigger AS
$$
begin
    new.tsv :=
                setweight(to_tsvector('simple', coalesce(unaccent(new.title), '')), 'A') ||
                setweight(to_tsvector('simple', coalesce(unaccent(new.league), '')), 'C');
    return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_tsvector_update
    BEFORE INSERT OR UPDATE
    ON team
    FOR EACH ROW
EXECUTE PROCEDURE team_search_trigger();

CREATE FUNCTION player_search_trigger() RETURNS trigger AS
$$
begin
    new.tsv :=
                    setweight(to_tsvector(coalesce(unaccent(new.name), '')), 'A') ||
                    setweight(to_tsvector(coalesce(unaccent(new.nationality), '')), 'D') ||
                    setweight(to_tsvector(coalesce(unaccent(new.team), '')), 'C');
    return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER player_tsvector_update
    BEFORE INSERT OR UPDATE
    ON player
    FOR EACH ROW
EXECUTE PROCEDURE player_search_trigger();

UPDATE team
SET tsv = setweight(to_tsvector('simple', coalesce(unaccent(title), '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(unaccent(league), '')), 'C');

UPDATE player
SET tsv = setweight(to_tsvector('simple', coalesce(unaccent(name), '')), 'A') ||
          setweight(to_tsvector('simple', coalesce(unaccent(nationality), '')), 'D') ||
          setweight(to_tsvector('simple', coalesce(unaccent(team), '')), 'C');

CREATE INDEX idx_player_name ON player USING GIN(name gin_trgm_ops);
CREATE INDEX idx_team_title ON team USING GIN(title gin_trgm_ops);