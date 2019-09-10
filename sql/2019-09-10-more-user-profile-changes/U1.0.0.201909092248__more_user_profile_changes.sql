DELETE FROM pg_enum
WHERE enumlabel = 'OTHER'
  AND enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'user_gender'
);
DROP TABLE "user_profile";
DROP TABLE "address";
ALTER TABLE "user" DROP COLUMN phone;
