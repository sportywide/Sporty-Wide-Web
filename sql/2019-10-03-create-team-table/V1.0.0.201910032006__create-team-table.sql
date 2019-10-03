CREATE TABLE "team"
(
    id          INTEGER PRIMARY KEY,
    name        VARCHAR(20) NOT NULL,
    title       VARCHAR(30) NOT NULL,
    image       VARCHAR(60) NOT NULL,
    att         INTEGER,
    mid         INTEGER,
    def         INTEGER,
    ovr         INTEGER,
    rating      VARCHAR(20) NOT NULL,
    league      VARCHAR(30),
    league_id   INTEGER REFERENCES league (id)
);
