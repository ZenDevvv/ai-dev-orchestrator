import { z } from "zod";
import type { Person } from "./person.zod";
import type { Pagination } from "~/types/pagination";

export const RoleEnum = z.enum(["superadmin", "viewer", "admin", "user"]);
export type Role = z.infer<typeof RoleEnum>;

export const SubRoleSchema = z.array(z.string()).optional().default([]);
export type SubRole = z.infer<typeof SubRoleSchema>;

export const StatusEnum = z.enum(["active", "inactive", "suspended", "archived"]);
export type Status = z.infer<typeof StatusEnum>;

export const createUserSchema = z.object({
	personId: z.string(),
	avatar: z.string().optional(),
	userName: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(8).optional(),
	role: RoleEnum,
	subRole: SubRoleSchema,
	organizationId: z.string().optional(),
	loginMethod: z.string().min(1),
});

export const updateUserSchema = createUserSchema.partial().extend({
	password: z.string().min(8).optional(),
});

export const userSchema = createUserSchema
	.extend({
		id: z.string(),
		status: StatusEnum.default("active"),
		isDeleted: z.boolean().default(false),
		lastLogin: z.date().nullable().optional(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.strict(); // Ensures no extra fields

export type User = z.infer<typeof userSchema>;

export type UserWithRelation = User & {
	person: Person;
};

export type GetAllUsers = {
	users: UserWithRelation[];
	pagination: Pagination;
	count: number;
};
