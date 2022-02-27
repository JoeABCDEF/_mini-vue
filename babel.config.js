// https://www.jestjs.cn/docs/getting-started
module.exports = {
	presets: [
		// 以我当前的node环境进行编译
		["@babel/preset-env", { targets: { node: "current" } }],
		// 使用 typescript 编译
		"@babel/preset-typescript",
	],
};
