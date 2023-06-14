CREATE TABLE `auth_key` (
	`expires` integer,
	`hashed_password` text,
	`id` text PRIMARY KEY NOT NULL,
	`primary_key` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_room` (
	`config` text,
	`id` text PRIMARY KEY NOT NULL,
	`media` text,
	`name` text,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`active_expires` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`idle_expires` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`last_names` text,
	`names` text,
	`username` text
);
