CREATE TABLE "player"
(
    id              INTEGER PRIMARY KEY,
    name            VARCHAR(20) NOT NULL,
    url             VARCHAR(30) NOT NULL,
    image           VARCHAR(60) NOT NULL,
    rating          INTEGER,
    age             INTEGER,
    positions       VARCHAR(60) NOT NULL,
    team            VARCHAR(30),
    team_id         INTEGER REFERENCES team (id),
    nationality     VARCHAR(30) NOT NULL,
    nationality_id  INTEGER NOT NULL
);
