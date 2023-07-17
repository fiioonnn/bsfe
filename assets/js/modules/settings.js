import Alert from "./alerts.js";

class Settings {
	constructor() {
		this.settings = {};
		this.load();
	}

	/**
	 * Saves the settings to localStorage
	 */
	save() {
		localStorage.setItem("settings", JSON.stringify(this.settings));
	}

	/**
	 * Loads the settings from localStorage
	 */
	load() {
		this.settings = JSON.parse(localStorage.getItem("settings")) || {};
	}

	/**
	 * Sets a setting
	 * @param {string} key
	 * @param {any} value
	 */
	set(key, value) {
		this.load();
		this.settings[key] = value;
		this.save();
	}

	/**
	 * Gets a setting
	 * @param {string} key
	 * @returns {any} value
	 */
	get(key) {
		this.load();

		return this.settings[key] || false;
	}
}

const settings = new Settings();

const functions = {
	expandByDefault: () => {},
	hideFieldIds: () => {
		if (settings.get("hideFieldIds")) {
			$(".field__id").hide();
			// Alert
			Alert.create({
				type: "info",
				message: "Field IDs are now hidden",
			});
		} else {
			$(".field__id").show();
			// Alert
			Alert.create({
				type: "info",
				message: "Field IDs are now shown",
			});
		}
	},
	hideTopBar: () => {
		if (settings.get("hideTopBar")) {
			$(".editor__details").hide();
		} else {
			$(".editor__details").show();
		}
	},
	closeAfterFieldAdded: null,
};

// Do something when site loaded
$(window).on("load", () => {
	// Settings » Hide Top Bar
	if (settings.get("hideTopBar")) {
		$(".editor__details").hide();
	}
});

// Load settings from localStorage
$(window).on("load", () => {
	$('[data-menu="settings"]')
		.children()
		.each(function (i) {
			if (i === 0) return;

			const checkbox = $(this).find("input[type='checkbox']")[0];
			$(checkbox).prop("checked", settings.get($(checkbox).attr("id")));
		});
});

$('[data-menu="settings"]')
	.children()
	.each(function (i) {
		if (i === 0) return;

		const checkbox = $(this).find("input[type='checkbox']")[0];

		$(checkbox).prop("checked", settings.get($(this).attr("id")));

		$(checkbox).on("change", function (e) {
			const checked = $(this).is(":checked");
			const id = $(this).attr("id");

			settings.set(id, checked);

			if (functions[id]) {
				functions[id]();
			}
		});
	});

export default new Settings();
