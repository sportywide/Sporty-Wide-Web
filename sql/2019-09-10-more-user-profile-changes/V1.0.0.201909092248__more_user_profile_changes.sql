ALTER TYPE user_gender ADD VALUE 'OTHER';

CREATE TABLE "address"
(
    id  SERIAL PRIMARY KEY,
    title VARCHAR(30),
    street1 VARCHAR(30),
    street2 VARCHAR(30),
    city    VARCHAR(30),
    state   VARCHAR(30),
    suburb  VARCHAR(30),
    country VARCHAR(30),
    postcode VARCHAR(20),
    lat REAL,
    lon REAL
);

CREATE TABLE "user_profile"
(
    id            SERIAL PRIMARY KEY,
    summary       TEXT,
    work          VARCHAR(30),
    education     VARCHAR(30),
    address_id    INT NULL,
    FOREIGN KEY (address_id) REFERENCES address(id)
);

ALTER TABLE "user" ADD COLUMN phone VARCHAR(30);
ALTER TABLE "user" ADD COLUMN dob DATE;
ALTER TABLE "user" ADD COLUMN user_profile_id INT NULL;
ALTER TABLE "user" ADD FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE;