CREATE TABLE "fixture"
(
    id         INTEGER PRIMARY KEY,
    home       VARCHAR(60) NOT NULL,
    away       VARCHAR(60) NOT NULL,
    home_id    INTEGER REFERENCES team (id),
    away_id    INTEGER REFERENCES team (id),
    link       VARCHAR(100),
    home_score INTEGER,
    away_score INTEGER,
    current    INTEGER,
    time       timestamptz NOT NULL
);
