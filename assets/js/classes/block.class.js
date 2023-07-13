import Fields from "./fields.class.js";

//Todo: Finish the Block class.
//Todo: build popup to copy or downloaad finished block.json
//Todo: Import blocks and translate them in the editor.

class Block {
	constructor() {
		this.json = {
			$schema: "https://app.blockstudio.dev/schema",
			name: "blockstudio/bfseblock",
			title: "BFSE Block",
			category: "text",
			icon: "star-filled",
			description: "BFSE Created Blockstudio Block.",
			keywords: ["block", "native"],
			version: "1.0.0",
			textdomain: "blockstudio",
			blockstudio: {
				attributes: [],
			},
		};
		this.blockSettings = document.querySelector("#blockSettings");

		this.init();
	}

	init() {
		this.loadBlockSettings();
		this.registerBlockSettings();
	}

	cleanup() {
		// Fields.each((field) => {
		// 	delete field.fieldId;
		// });
	}

	show() {
		this.cleanup();
		this.prepare();
		console.log(JSON.stringify(this.json, null, 4));
	}

	prepare() {
		this.json.blockstudio.attributes = Fields.fields;
	}

	loadBlockSettings() {
		const inputs = this.blockSettings.querySelectorAll("input");

		inputs.forEach((input) => {
			input.value = this.json[input.name];
		});
	}

	registerBlockSettings() {
		const inputs = this.blockSettings.querySelectorAll("input");

		inputs.forEach((input) => {
			input.addEventListener("input", () => {
				if (input.name === "keywords") {
					this.json[input.name] = input.value.split(",");
					return;
				}

				this.json[input.name] = input.value;
			});
		});
	}
}

export default new Block();
