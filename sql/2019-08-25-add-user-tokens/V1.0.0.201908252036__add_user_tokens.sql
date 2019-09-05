CREATE TYPE token_type AS ENUM ('FORGOT_PASSWORD', 'CONFIRM_EMAIL');
CREATE TABLE tokens
(
    id            SERIAL PRIMARY KEY,
    created_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    type		  token_type NOT NULL,
    engagement_table varchar(30) NOT NULL,
    engagement_id  integer NOT NULL,
    content varchar(100) NOT NULL,
    ttl timestamptz NOT NULL
);
