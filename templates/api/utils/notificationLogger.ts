import { Request } from "express";
import { PrismaClient } from "../generated/prisma";
import { getUsersByRole } from "../helper/roleHelper";

const prisma = new PrismaClient();

export async function getRecipients(role: string) {
	const users = await getUsersByRole(role as "user" | "admin" | "viewer");
	return users.map((user) => user.id);
}

/**
 * Logs notifications to the Notification microservice.
 */
export async function logNotification(
	req: Request,
	payload: {
		role: string;
		source: string;
		category: string;
		title: string;
		description: string;
		recipients?: {
			read: Array<{ user: string; date: Date }>;
			unread: Array<{ user: string; date: Date }>;
		};
		metadata?: any;
	},
) {
	try {
		// Get recipients by role if not provided
		let recipients = payload.recipients;
		if (!recipients) {
			const users = await getUsersByRole(payload.role as "user" | "admin" | "viewer");

			if (users.length === 0) {
				console.log(`No users found for role ${payload.role}`);
				return; // Skip notification if no recipients
			}

			const recipientIds = users.map((user) => user.id);
			recipients = {
				read: [],
				unread: recipientIds.map((id) => ({ user: id, date: new Date() })),
			};
		}

		const authenticatedUserId = (req as any).userId as string | undefined;
		const notificationData = {
			source: authenticatedUserId || "unknown",
			category: payload.category,
			title: payload.title,
			description: payload.description,
			recipients: recipients,
			metadata: payload.metadata,
		};

		// Fire-and-forget logging
		prisma.notification
			.create({
				data: notificationData,
			})
			.catch((err) => console.error("Notification DB insert failed:", err.message));
	} catch (error: any) {
		console.error("Failed to log notification:", error.message);
	}
}
