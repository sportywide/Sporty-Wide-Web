CREATE TABLE "league"
(
    id    INTEGER PRIMARY KEY,
    name  VARCHAR(20) NOT NULL,
    title VARCHAR(30) NOT NULL,
    image VARCHAR(60) NOT NULL
);

CREATE TABLE "user_league"
(
    id         SERIAL PRIMARY KEY,
    user_id    SERIAL REFERENCES public.user (id),
    league_id  INTEGER REFERENCES league (id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO league(id, name, title, image)
VALUES (13,
        'premier-league',
        'Premier League',
        '/static/leagues/premier-league.svg'),
       (53,
        'la-liga',
        'La Liga Santander',
        '/static/leagues/laliga.svg'),
       (19,
        'bundesliga',
        'Bundesliga',
        '/static/leagues/bundesliga.svg'),
       (31,
        'serie-a',
        'Serie A TIM',
        '/static/leagues/serie-a.svg'),
       (16,
        'ligue-one',
        'Ligue 1 Conforama',
        '/static/leagues/ligue-1.svg');
