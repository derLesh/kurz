import { sqliteTable, text, integer,  } from "drizzle-orm/sqlite-core";
			
export const user = sqliteTable("user", {
					id: text("id").primaryKey(),
					name: text('name').notNull(),
					username: text('username').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
 image: text('image'),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
				});

export const session = sqliteTable("session", {
					id: text("id").primaryKey(),
					expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
 token: text('token').notNull().unique(),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const account = sqliteTable("account", {
					id: text("id").primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
 refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
 scope: text('scope'),
 password: text('password'),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
				});

export const verification = sqliteTable("verification", {
					id: text("id").primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
 createdAt: integer('created_at', { mode: 'timestamp' }),
 updatedAt: integer('updated_at', { mode: 'timestamp' })
				});

export const links = sqliteTable("links", {
	id: text("id").primaryKey(),
	url: text("url").notNull(),
	kurz: text("kurz").notNull().unique(),
	description: text("description"),
	clicks: integer("clicks").notNull().default(0),
	lastClick: integer('last_click', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
});

export const texts = sqliteTable("texts", {
	id: text("id").primaryKey(),
	textCode: text("text_code").notNull().unique(),
	text: text("text").notNull(),
	title: text("title").notNull(),
	syntax: text("syntax"),
	password: text("password"),
	views: integer("views").notNull().default(0),
	viewLimit: integer("view_limit"),
	lastView: integer('last_view', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});
