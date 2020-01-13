CREATE TABLE "player_betting"
(
    id            SERIAL PRIMARY KEY,
    created_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    bet_rating    INTEGER,
    real_rating   INTEGER,
    bet_tokens    INTEGER,
    earned_tokens INTEGER,
    calculated    BOOLEAN DEFAULT FALSE,
    week          DATE,
    fixture_id    INTEGER NOT NULL,
    user_id       INTEGER NOT NULL,
    player_id     INTEGER NOT NULL,
    team_id       INTEGER NOT NULL
);

CREATE INDEX idx_player_betting_user_id_date ON player_betting (user_id, week);
CREATE INDEX idx_player_betting_player_fixture_id ON player_betting (player_id, fixture_id);

CREATE TABLE "user_score"
(
    user_id    INTEGER NOT NULL,
    league_id  INTEGER NOT NULL,
    season     VARCHAR(10),
    tokens     INTEGER DEFAULT 0
);

CREATE INDEX idx_user_score_user_season_league ON user_score (user_id, league_id, season);
