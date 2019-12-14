CREATE TABLE "fixture"
(
    id         INTEGER PRIMARY KEY,
    home       VARCHAR(60) NOT NULL,
    away       VARCHAR(60) NOT NULL,
    home_id    INTEGER REFERENCES team (id) ON DELETE CASCADE,
    away_id    INTEGER REFERENCES team (id) ON DELETE CASCADE,
    season     VARCHAR(10),
    league_id  INTEGER REFERENCES league(id) ON DELETE CASCADE,
    status     VARCHAR(10),
    link       VARCHAR(100),
    home_score INTEGER,
    away_score INTEGER,
    current    INTEGER,
    time       timestamptz NOT NULL
);

CREATE INDEX fixture_status ON fixture(status);
