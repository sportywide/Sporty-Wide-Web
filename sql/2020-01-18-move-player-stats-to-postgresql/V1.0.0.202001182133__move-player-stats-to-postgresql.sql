CREATE TABLE "player_stat"
(
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    created_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    league_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    played INTEGER,
    scored INTEGER,
    yellow INTEGER,
    red INTEGER,
    status VARCHAR(10),
    season VARCHAR(10),
    chance NUMERIC
);

CREATE UNIQUE INDEX idx_player_stat ON player_stat (player_id, season);
