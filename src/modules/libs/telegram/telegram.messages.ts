import type { SponsorshipPlan, User } from "@/prisma/generated";
import type { SessionMetadata } from "@/shared/types/session-metadata.types";
import { escapeHtml } from "@/shared/utils/escape-html.util";

export const MESSAGES = {
	welcome:
		`<b>👋 Welcome to Streaming Platform Bot!</b>\n\n` +
		`To receive notifications and get more out of the platform, let's link your Telegram account with Streaming Platform.\n\n` +
		`Click the button below and go to the <b>Notifications</b> section to finish the setup.`,
	invalidToken: "❌ Invalid or expired token.",
	authSuccess: `🎉 You've successfully authorized, and your Telegram account is now linked with Streaming Platform!\n\n`,
	notLinked:
		"Your account isn't linked yet. Connect Telegram in the notification settings on the website.",
	profile: (user: User, followersCount: number) =>
		`<b>👤 User profile:</b>\n\n` +
		`👤 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Followers: <b>${followersCount}</b>\n` +
		`📝 About: <b>${escapeHtml(user.bio || "Not specified")}</b>\n\n` +
		`🔧 Click the button below to go to your profile settings.`,
	follows: (user: User) =>
		`📺 <a href="${process.env.SITE_URL_TELEGRAM}/${escapeHtml(user.username)}">${escapeHtml(user.username)}</a>`,
	followsList: (list: string) => `<b>🌟 Channels you follow:</b>\n\n${list}`,
	noFollows: "<b>❌ You don't follow any channels.</b>",
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Password reset</b>\n\n` +
		`You requested a password reset for your account on <b>Streaming Platform</b>.\n\n` +
		`To create a new password, please follow this link:\n\n` +
		`<b><a href="${process.env.SITE_URL_TELEGRAM}/account/recovery/${token}">Reset password</a></b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request details:</b>\n\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Operating system:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP address:</b> ${metadata.ip}\n\n` +
		`If you didn't make this request, just ignore this message.\n\n` +
		`Thanks for using <b>Streaming Platform</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Account deactivation request</b>\n\n` +
		`You've started deactivating your account on <b>Streaming Platform</b>.\n\n` +
		`To complete the process, please confirm your request by entering the following confirmation code:\n\n` +
		`<b>Confirmation code: ${token}</b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request details:</b>\n\n` +
		`• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`• 📱 <b>Operating system:</b> ${metadata.device.os}\n` +
		`• 🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`• 💻 <b>IP address:</b> ${metadata.ip}\n\n` +
		`<b>What happens after deactivation?</b>\n\n` +
		`1. You'll be logged out automatically and lose access to your account.\n` +
		`2. If you don't cancel the deactivation within 7 days, your account will be <b>permanently deleted</b> with all your information, data and subscriptions.\n\n` +
		`<b>⏳ Please note:</b> If you change your mind within 7 days, you can contact our support to restore access to your account before it's fully deleted.\n\n` +
		`Once your account is deleted, it can't be restored, and all data will be lost for good.\n\n` +
		`If you've changed your mind, just ignore this message. Your account will stay active.\n\n` +
		`Thanks for using <b>Streaming Platform</b>! We're always glad to see you on our platform and hope you'll stay with us. 🚀\n\n` +
		`Best regards,\n` +
		`The Streaming Platform team`,
	accountDeleted: () =>
		`<b>⚠️ Your account has been fully deleted.</b>\n\n` +
		`Your account has been completely erased from the Streaming Platform database. All your data and information have been permanently deleted. ❌\n\n` +
		`🔒 You'll no longer receive notifications in Telegram or by email.\n\n` +
		`If you ever want to come back to the platform, you can sign up using the link below:\n` +
		`<b><a href="${process.env.SITE_URL_TELEGRAM}/account/create">Sign up for Streaming Platform</a></b>\n\n` +
		`Thanks for being with us! We'll always be glad to see you on the platform. 🚀\n\n` +
		`Best regards,\n` +
		`The Streaming Platform team`,
	streamStart: (channel: User) =>
		`<b>🎬 ${escapeHtml(channel.displayName)} just started a stream!</b>\n\n` +
		`Watch here: <a href="${process.env.SITE_URL_TELEGRAM}/${escapeHtml(channel.username)}">Go to the stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>You have a new follower!</b>\n\nIt's user <a href="${process.env.SITE_URL_TELEGRAM}/${escapeHtml(follower.username)}">${escapeHtml(follower.displayName)}</a>\n\nTotal followers on your channel: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 New sponsorship!</b>\n\n` +
		`You've received a new sponsorship on the <b>${escapeHtml(plan.title)}</b> plan.\n` +
		`💰 Amount: <b>${plan.price} €</b>\n` +
		`👤 Sponsor: <a href="${process.env.SITE_URL_TELEGRAM}/${escapeHtml(sponsor.username)}">${escapeHtml(sponsor.displayName)}</a>\n` +
		`📅 Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>\n\n` +
		`Thanks for your work and support on Streaming Platform!`,
	enableTwoFactor: () =>
		`🔐 <b>Secure your account!</b>\n\n` +
		`Enable two-factor authentication in your <a href="${process.env.SITE_URL_TELEGRAM}/dashboard/settings">account settings</a>.`,
	verifyChannel: () =>
		`<b>🎉 Congratulations! Your channel is verified</b>\n\n` +
		`We're happy to let you know that your channel is now verified and has the official badge.\n\n` +
		`The verification badge confirms that your channel is authentic and helps viewers trust it.\n\n` +
		`Thanks for being with us and growing your channel with Streaming Platform!`,
} as const;
