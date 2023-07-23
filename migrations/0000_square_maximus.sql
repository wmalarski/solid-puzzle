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
--> statement-breakpoint
CREATE TABLE `auth_key` (
	`expires` integer,
	`hashed_password` text,
	`id` text PRIMARY KEY NOT NULL,
	`primary_key` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `message` (
	`content` text NOT NULL,
	`deleted` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`ord` integer NOT NULL,
	`sender` text(255) NOT NULL,
	`space_id` text NOT NULL,
	`version` integer NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `replicache_client` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`last_mutation_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`active_expires` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`idle_expires` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `space` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`last_names` text,
	`names` text,
	`username` text
);
