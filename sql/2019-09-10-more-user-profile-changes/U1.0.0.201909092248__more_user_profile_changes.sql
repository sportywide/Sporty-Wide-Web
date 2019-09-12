DELETE FROM pg_enum
WHERE enumlabel = 'OTHER'
  AND enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'user_gender'
);
ALTER TABLE "user" DROP COLUMN phone;
ALTER TABLE "user" DROP COLUMN dob;
ALTER TABLE "user" DROP COLUMN user_profile_id;
DROP TABLE "user_profile";
DROP TABLE "address";
