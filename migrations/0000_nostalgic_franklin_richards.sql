CREATE TABLE `auth_session` (
	`active_expires` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`idle_expires` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`last_names` text,
	`names` text,
	`password` text,
	`username` text
);
--> statement-breakpoint
CREATE TABLE `game_room` (
	`config` text NOT NULL,
	`created_at` numeric DEFAULT (CURRENT_TIMESTAMP),
	`id` text PRIMARY KEY NOT NULL,
	`media` text NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	`updated_at` numeric DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`owner_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
