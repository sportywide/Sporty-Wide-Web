UPDATE public.user SET user_profile_id = NULL;
DELETE FROM user_profile;

ALTER TABLE public.user DROP COLUMN user_profile_id;

ALTER TABLE "user_profile" ADD COLUMN user_id INT NULL;
ALTER TABLE "user_profile" ADD FOREIGN KEY (user_id) REFERENCES public.user(id);