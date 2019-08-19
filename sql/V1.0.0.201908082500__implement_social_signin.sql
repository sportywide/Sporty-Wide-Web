create type user_gender AS enum ('MALE', 'FEMALE');
create type social_provider AS enum('FACEBOOK', 'GOOGLE');

ALTER TABLE "user"
    ADD COLUMN social_provider varchar(30),
    ADD COLUMN social_id varchar(30),
    ADD COLUMN gender user_gender;
