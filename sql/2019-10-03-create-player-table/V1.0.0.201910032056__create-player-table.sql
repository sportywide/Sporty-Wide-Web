CREATE TABLE "player"
(
    id              INTEGER PRIMARY KEY,
    name            VARCHAR(60) NOT NULL,
    url             VARCHAR(60) NOT NULL,
    image           VARCHAR(60) NOT NULL,
    rating          INTEGER,
    age             INTEGER,
    positions       VARCHAR(60) NOT NULL,
    team            VARCHAR(60),
    team_id         INTEGER REFERENCES team (id),
    nationality     VARCHAR(60) NOT NULL,
    nationality_id  INTEGER NOT NULL
);
