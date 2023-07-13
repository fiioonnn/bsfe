function generateRandomString(length) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

// function to convert text to types
function convertToType(text) {
	if (text === "true") {
		return true;
	} else if (text === "false") {
		return false;
	} else if (text === "") {
		return "";
	} else if (!isNaN(text)) {
		return Number(text);
	} else if (Array.isArray(text)) {
		return Array.from([]);
	} else {
		return text;
	}
}

class Utils {
	constructor() {
		this.msg = {
			TB_NAV_BROKEN: "Toolbar is broken - Please check the HTML structure.",
			TB_NAV_MENU_NOT_FOUND: "Selected menu not found.",
		};
	}

	/**
	 * Returns an HTMLElement or NodeList
	 * @param {string} selector
	 * @returns HTMLElement | NodeList
	 */
	select(selector) {
		const result = document.querySelectorAll(selector);

		if (result.length > 1) {
			return result;
		}

		return result[0];
	}
}
export { generateRandomString, convertToType, Utils };
