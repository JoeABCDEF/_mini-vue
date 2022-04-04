import { h } from "./../../lib/guide-mini-vue.esm.js";

export default {
	render() {
		console.log(this);
		console.log(this.$el);
		window.self = this;
		return h(
			"div",
			{
				id: "root",
				class: ["s"],
			},
			[
				// h(`**&&${this.msg}`),
				h("p", { class: ["cadetblue"] }, "第一个"),
				h("p", { class: ["brown"] }, "第二个"),
				h("p", { class: ["brown"] }, `**&&${this.msg}`),
			]
		);
	},
	setup() {
		// s

		return {
			msg: "min-vue__safa",
		};
	},
};
