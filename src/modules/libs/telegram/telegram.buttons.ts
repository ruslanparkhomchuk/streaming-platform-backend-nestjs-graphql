import { Markup } from "telegraf";

type InlineKeyboard = ReturnType<typeof Markup.inlineKeyboard>;

function getSiteUrl() {
	return process.env.SITE_URL_TELEGRAM ?? "";
}

export const BUTTONS: {
	authSuccess: () => InlineKeyboard;
	profile: () => InlineKeyboard;
} = {
	authSuccess: () =>
		Markup.inlineKeyboard([
			[
				Markup.button.callback("📜 My followings", "follows"),
				Markup.button.callback("👤 View profile", "me"),
			],
			[Markup.button.url("🌐 Go to the website", getSiteUrl())],
		]),
	profile: () =>
		Markup.inlineKeyboard([
			Markup.button.url(
				"⚙️ Account settings",
				`${getSiteUrl()}/dashboard/settings`,
			),
		]),
};
