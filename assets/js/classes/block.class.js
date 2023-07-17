import Fields from "./fields.class.js";

//Todo: Finish the Block class.
//Todo: build popup to copy or downloaad finished block.json
//Todo: Import blocks and translate them in the editor.
// Todo: do net edit the real field, make a copy and edit+return that.

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

	generate() {
		const fields = JSON.parse(JSON.stringify(Fields.fields));

		Fields.each((field) => {
			// Remove the fieldId from the field
			delete field.fieldId;
			// Fix for the token field
			if (field.options && field.type === "token") {
				field.options = field.options.map((option) => option.value);
				return;
			}

			// Fix for checkbox
			if (field.type === "checkboxOption") {
				delete field.type;
			}

			if (field?.min === 0) {
				delete field.min;
			}

			if (field?.max === 0) {
				delete field.max;
			}

			if (field?.opened === false) {
				delete field.opened;
			}

			Object.entries(field).forEach(([key, value]) => {
				if (value === "") {
					delete field[key];
				}
			});
		}, fields);

		this.json.blockstudio.attributes = fields;
		return JSON.stringify(this.json, null, 4);
	}

	generateIndex() {
		let fields = ``;
		Fields.each((field) => {
			const parent = Fields.findParent(field.id);
			if (parent) {
				fields += `${parent.id}_${field.id} `;
				return;
			}
			fields += `${field.id || field.name} `;
		});
		const content = `
			<?php
				// Blockstudio variables
				// text_oyadn7ans » Text
				// text_oyadn7ans » Text
				${fields}
			?>
			<div class="blockname">

			</div>
		`;

		return content;
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
