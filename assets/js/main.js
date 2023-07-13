import "./lib/jquery.js";
import "./modules/editor.js";
import "./modules/settings.js";
import Loader from "./modules/loader.js";
import Alert from "./modules/alerts.js";
import Toolbar from "./classes/toolbar.class.js";
import fieldSettings from "./classes/fieldSettings.class.js";
import Fields from "./classes/fields.class.js";
import Block from "./classes/block.class.js";

$("#saveBtn").on("click", () => {
	console.log(1);
	Block.show();
});

// $(".toolbar__field-settings").css({
// 	maxHeight: $(".toolbar__field-settings").height() - 46,
// });

Alert.create({
	type: "info",
	message: "Welcome to BFSE v3.0",
});

Loader.set({
	text: "Loading...",
	event: "load",
});
