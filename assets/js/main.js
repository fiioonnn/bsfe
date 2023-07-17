import "./lib/jquery.js";
import "./lib/prism.js";
import Loader from "./modules/loader.js";
import Alert from "./modules/alerts.js";
import Toolbar from "./classes/toolbar.class.js";
import fieldSettings from "./classes/fieldSettings.class.js";
import Fields from "./classes/fields.class.js";
import Block from "./classes/block.class.js";
import Popup from "./classes/popup.class.js";
import Settings from "./modules/settings.js";

import Export from "./classes/export.class.js";

$("#saveBtn").on("click", () => {
	Block.generate();
});

Loader.set({
	text: "Loading...",
});

//
// Initialize BSFE
//
fetch("assets/js/data/fields.json")
	.then((res) => {
		return res.json();
	})
	.then((res) => {
		const fieldTypes = res.fieldTypes;
		const fieldIcons = res.fieldIcons;

		Fields.types = fieldTypes;
		Fields.icons = fieldIcons;
		Fields.initCache();
	})
	.then(() => {
		Loader.set({
			text: "Initializing Toolbar...",
		});
		Toolbar.init();
	})
	.then(() => {
		Loader.set({
			text: "Initializing Export...",
		});
		Export.init();
	})
	.then(() => {
		Loader.set({
			text: "Lets go!...",
		});
		Loader.hide();
	})
	.then(() => {
		if (!Settings.get("firstTime")) {
			Popup.show({
				title: "Welcome to BSFE!",
				message: [
					"Welcome to the Blockstudio Field Editor. (This is a prerelease version)",
					"Please report any bugs or issues you find to the <a href='https://github.com/fiioonnn/bsfe/issues' target='_blank'>GitHub Repository</a>.",
					"To understand the structure of the fields, please refer to the <a href='https://blockstudio.dev/documentation/' target='_blank'>Blockstudio documentation</a>.",
					"<b>Planned features:</b>",
					`► Import your block.json file`,
					`► Drag & Drop fields`,
					`► History (Undo/Redo)`,
					`► Group Style property`,
					`► Check <a href='https://github.com/fiioonnn/bsfe/issues' target='_blank'>GitHub</a> for all planned features..`,

					"<b>What's <u class='red'>not</u> included?</b>",
					`► Conditional Logic (<a href='https://blockstudio.dev/documentation/attributes/conditional-logic/' target='_blank'>Learn more</a>)`,
					"",
				],
			});
		}
		Alert.create({
			type: "info",
			message: "Welcome to BFSE v3.0",
		});
	})
	.catch((err) => {
		Loader.set({
			text: "Captain, we have a problem!...",
		});
		Alert.create({
			type: "error",
			message: "Error! Please check the console for more information.",
			duration: 10000,
		});
		console.log(err);
	});

// $(".toolbar__field-settings").css({
// 	maxHeight: $(".toolbar__field-settings").height() - 46,
// });
