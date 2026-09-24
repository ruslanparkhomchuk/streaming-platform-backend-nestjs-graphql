/** @type {import("prettier").Config} */
export default {
	trailingComma: "all",
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	jsxSingleQuote: false,
	arrowParens: "avoid",
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderCaseInsensitive: true,
	importOrderParserPlugins: [
		"classProperties",
		"decorators-legacy",
		"typescript",
	],
	importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^../(.*)", "^./(.*)"],
	plugins: ["@trivago/prettier-plugin-sort-imports"],
};
