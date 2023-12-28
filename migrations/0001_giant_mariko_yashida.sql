ALTER TABLE auth_session ADD `expires_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_session` DROP COLUMN `active_expires`;--> statement-breakpoint
ALTER TABLE `auth_session` DROP COLUMN `idle_expires`;--> statement-breakpoint
ALTER TABLE `auth_user` DROP COLUMN `last_names`;--> statement-breakpoint
ALTER TABLE `auth_user` DROP COLUMN `names`;