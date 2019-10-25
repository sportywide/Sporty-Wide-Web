ALTER TABLE "team"
    ADD COLUMN founded integer,
    ADD COLUMN venue_name varchar(50),
    ADD COLUMN venue_address varchar(100),
    ADD COLUMN venue_city varchar(50),
    ADD COLUMN venue_capacity integer;