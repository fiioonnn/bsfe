import FieldsSettings from "./fieldSettings.class.js";
import Editor from "./editor.class.js";
import Settings from "../modules/settings.js";
import Fields from "./fields.class.js";

class Toolbar {
	constructor() {
		this.navParents = document.querySelectorAll(".nav__item--parent");
		this.navSubmenus = document.querySelectorAll(".nav__list--sub");
		this.fieldSettings = document.querySelector("#fieldSettings");
		this.addFieldsMenu = document.querySelector('[data-menu="addFields"]');
		this.addFieldsContext = null;

		this.initialize();
	}

	/**
	 * Getter
	 * @param {*} key
	 * @returns
	 */
	get(key) {
		return this[key];
	}

	/**
	 * Setter
	 * @param {*} key
	 * @param {*} value
	 */
	set(key, value) {
		this[key] = value;
	}

	/**
	 * Initialize the toolbar
	 */
	initialize() {
		this.registerMenus();
		this.fixZIndex();
		this.fixFieldSettingsHeight();
		this.addFieldTypes();
		this.registerAddField();
	}

	addFieldTypes() {
		if (!this.addFieldsMenu) return;

		Object.entries(Fields.types).forEach(([key, value]) => {
			const item = document.createElement("li");
			item.classList.add("nav__item");
			item.setAttribute("data-field-type", key);

			const icon = document.createElement("i");
			icon.classList.add("nav__icon");
			icon.classList.add("fas");
			icon.classList.add(value.icon);

			item.innerHTML = `<i class="fa-regular ${Fields.icons[key]}"></i> ${key}`;

			this.addFieldsMenu.appendChild(item);
		});
	}

	/**
	 * Register the menus and enable controlling.
	 * @returns {void}
	 */
	registerMenus() {
		if (!this.navParents || !this.navSubmenus) return;

		this.navParents.forEach((parent) => {
			const submenu = parent?.nextElementSibling;
			const returnBtn = submenu?.querySelector(".nav__item--return");

			// Error handling
			if (!returnBtn || !submenu) {
				throw new Error("Navigation is broken, please check the HTML.");
			}

			returnBtn.onclick = (e) => {
				submenu.classList.remove("nav__list--active");
				this.addFieldsContext = null;
				setTimeout(() => {
					this.setReturnTitle("addFields", "");
				}, 300);
			};

			parent.onclick = (e) => {
				submenu.classList.add("nav__list--active");
			};
		});
	}

	/**
	 * Add a Title inside a Menus return item.
	 *
	 */
	setReturnTitle(menuId, text) {
		const menu = document.querySelector(`[data-menu="${menuId}"]`);
		const returnItem = menu.querySelector(".nav__item--return");

		returnItem.innerHTML = text;
	}

	/**
	 * Register the add field buttons.
	 * @returns {void}
	 */
	registerAddField() {
		const addFieldItems = document.querySelectorAll("[data-field-type]");

		if (!addFieldItems) return;

		addFieldItems.forEach((item) => {
			item.onclick = (e) => {
				const fieldType = item.getAttribute("data-field-type");

				Editor.add(fieldType, this.addFieldsContext);

				if (Settings.get("closeAfterFieldAdded")) {
					this.closeAllMenus();
					this.addFieldsContext = null;
				}
			};
		});
	}

	/**
	 * Manualy open a menu.
	 * @param {string} menuId
	 * @returns {void}
	 */
	openMenu(menuId) {
		const menu = document.querySelector(`[data-menu="${menuId}"]`);

		// Error handling
		if (!menu) {
			throw new Error("Menu not found.");
		}

		menu.classList.add("nav__list--active");
	}

	/**
	 * Manualy close a menu.
	 * @param {string} menuId
	 * @returns {void}
	 */
	closeMenu(menuId) {
		const menu = document.querySelector(`[data-menu="${menuId}"]`);

		// Error handling
		if (!menu) {
			throw new Error(`Menu ${menuId} not found.`);
		}

		menu.classList.remove("nav__list--active");
	}

	hideMenu(menuId) {
		const menu = document.querySelector(`[data-for="${menuId}"]`);

		// Error handling
		if (!menu) {
			throw new Error(`Menu ${menuId} not found.`);
		}

		menu.classList.add("nav__list--hidden");
	}

	/**
	 * Manualy close all menus.
	 * @returns {void}
	 */
	closeAllMenus() {
		if (!this.navSubmenus) return;

		this.navSubmenus.forEach((submenu) => {
			submenu.classList.remove("nav__list--active");
		});
	}

	/**
	 * Apply z-index to all submenus, to fix visual bug.
	 * @returns {void}
	 */
	fixZIndex() {
		if (!this.navSubmenus) return;

		this.navSubmenus.forEach((submenu, i) => {
			submenu.style.zIndex = (i + 1) * 3;
		});
	}

	/**
	 * Resets the Toolbar
	 * @returns {void}
	 */
	reset() {
		this.closeAllMenus();
		this.setReturnTitle("addFields", "");
		this.set("addFieldsContext", null);
		FieldsSettings.close();
	}

	/**
	 * Opens the add field menu.
	 * @param {string} parentId
	 * @returns {void}
	 */
	addFields(fieldId) {
		this.set("addFieldsContext", fieldId);
		this.closeAllMenus();
		this.openMenu("addFields");
		this.setReturnTitle("addFields", `(${fieldId})`);
	}

	/**
	 * Fix the height of the field settings menu.
	 * @returns {void}
	 */
	fixFieldSettingsHeight() {
		if (!this.fieldSettings) return;

		this.fieldSettings.style.maxHeight = this.fieldSettings.clientHeight + "px";
	}
}

export default new Toolbar();
