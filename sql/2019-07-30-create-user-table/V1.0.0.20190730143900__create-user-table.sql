create type user_role AS enum ('ADMIN', 'USER');
create type user_status AS enum ('PENDING', 'ACTIVE');
CREATE TABLE "user"
(
    id            SERIAL PRIMARY KEY,
    created_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamptz  DEFAULT CURRENT_TIMESTAMP,
    first_name    varchar(30)  NOT NULL,
    last_name     varchar(30)  DEFAULT NULL,
    email         varchar(50)  NOT NULL,
    username      varchar(50)  NOT NULL,
    role          user_role    DEFAULT 'USER',
    status        user_status  DEFAULT 'PENDING',
    password      varchar(255) NOT NULL,
    refresh_token varchar(255) DEFAULT NULL,
    CONSTRAINT uq_user_email UNIQUE (email),
    CONSTRAINT uq_user_username UNIQUE (username)
);
