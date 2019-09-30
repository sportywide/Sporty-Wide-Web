CREATE TABLE "league"
(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(20) NOT NULL,
    title VARCHAR(30) NOT NULL,
    image VARCHAR(60) NOT NULL
);

CREATE TABLE "user_league"
(
    id         SERIAL PRIMARY KEY,
    user_id    SERIAL REFERENCES public.user (id),
    league_id  SERIAL REFERENCES league (id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO league(name, title, image)
VALUES ('premier-league',
        'Premier League',
        '/static/leagues/premier-league.svg'),
       ('la-liga',
        'La Liga',
        '/static/leagues/laliga.svg'),
       ('bundesliga',
        'Bundesliga',
        '/static/leagues/bundesliga.svg'),
       ('serie-a',
        'Serie A',
        '/static/leagues/serie-a.svg'),
       ('ligue-one',
        'League One',
        '/static/leagues/ligue-1.svg');