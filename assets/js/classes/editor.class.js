import Fields from "./fields.class.js";
import Settings from "../modules/settings.js";
import Toolbar from "./toolbar.class.js";
import FieldSettings from "./fieldSettings.class.js";
import Conditions from "./conditions.class.js";

class Editor {
	constructor() {
		this.editor = document.querySelector(".editor");
		this.editorInner = document.querySelector(".editor__inner");
		this.fields = document.querySelector("#fields");

		this.init();
	}

	/**
	 * Initialize the Editor
	 * @returns {void}
	 */
	init() {
		this.registerEvents();
	}

	/**
	 * Adds a new Field to the Editor
	 * @param {fieldType} fieldType
	 * @param {fieldId} parentId
	 */
	add(fieldType, parentId = null) {
		const field = Fields.add(fieldType, parentId);
		const fieldElement = this.createField(field);

		console.log(Settings.get("expandedByDefault"));
		if (Settings.get("expandByDefault")) {
			this.expandField(fieldElement);
		}

		if (parentId) {
			const parentElement = document.querySelector(`#${parentId}`);
			const parentAttributes =
				parentElement.querySelector(".field__attributes");

			// Add field to parent's attributes (HTML)
			parentAttributes.appendChild(fieldElement);

			// Expand parent field
			this.expandField(parentElement);
		} else {
			// Add field to fields (HTML)
			this.fields.appendChild(fieldElement);
		}
		// Select the field
		this.selectField(fieldElement);

		// Add events to field (HTML)
		this.fieldEvents(fieldElement);
	}

	/**
	 * Registers all needed events
	 * @param {fieldElement} fieldElement
	 */
	fieldEvents(fieldElement) {
		const fieldId = fieldElement.id;
		const fieldHead = fieldElement.querySelector(".field__head");

		fieldHead.onclick = (e) => {
			const target = e.target;

			// Add attributes/options
			if (target.dataset.id === "add") {
				Toolbar.addFields(fieldId);
				this.selectField(fieldElement);
			}

			// Remove the field
			if (target.dataset.id === "remove") {
				this.removeField(fieldElement);
			}

			// Move the field up
			if (target.dataset.id === "moveUp") {
				this.moveField(fieldElement, "up");
			}

			// Move the field down
			if (target.dataset.id === "moveDown") {
				this.moveField(fieldElement, "down");
			}

			// Expand/Collapse the field
			if (target.dataset.id === "toggle") {
				if (fieldElement.classList.contains("field--expanded")) {
					this.collapseField(fieldElement);
				} else {
					this.expandField(fieldElement);
				}

				this.selectField(fieldElement);
			}

			// Select the field
			if (target.dataset.id === undefined) {
				this.toggleField(fieldElement);
			}
		};
	}

	/**
	 * Moves a field inside the editor
	 * @param {fieldElement} fieldElement
	 * @param {direction} direction
	 */
	moveField(fieldElement, direction) {
		const fieldId = fieldElement.id;

		// move element one up in dom
		if (direction === "up") {
			const prevElement = fieldElement.previousElementSibling;

			if (prevElement) {
				fieldElement.parentNode.insertBefore(fieldElement, prevElement);
			}
		}

		// move element one down in dom
		if (direction === "down") {
			const nextElement = fieldElement.nextElementSibling;

			if (nextElement) {
				fieldElement.parentNode.insertBefore(nextElement, fieldElement);
			}
		}

		Fields.move(fieldId, direction);

		// this.selectField(fieldElement);
	}

	/**
	 * Toggle the selection of a field
	 * @param {fieldElement}
	 */
	toggleField(fieldElement) {
		if (fieldElement.classList.contains("field--selected")) {
			this.unselectField(fieldElement);
		} else {
			this.selectField(fieldElement);
		}
	}

	/**
	 * Selects a field
	 * @param {fieldElement} fieldElement
	 * @returns {void}
	 */
	selectField(fieldElement) {
		const fieldId = fieldElement.id;

		// Unselect all other fields
		this.unselectAllFields();

		fieldElement.classList.add("field--selected");

		// Open the field properties in the field settings panel
		FieldSettings.open(fieldId);
	}

	/**
	 * Unselects a field
	 * @param {fieldElement}
	 * @returns {void}
	 */
	unselectField(fieldElement) {
		fieldElement.classList.remove("field--selected");
		FieldSettings.close();
	}

	/**
	 * Unselects all fields
	 * @returns {void}
	 */
	unselectAllFields() {
		const fields = Array.from(document.querySelectorAll(".field"));

		fields.forEach((field) => {
			this.unselectField(field);
		});
	}

	/**
	 * Expands a field
	 * @param {fieldElement}
	 * @returns {void}
	 */
	expandField(fieldElement) {
		const icon = fieldElement.querySelector(`button[data-id="toggle"] > i`); //!BUG

		icon.classList.remove("fa-eye");
		icon.classList.add("fa-eye-slash");

		fieldElement.classList.add("field--expanded");
	}

	/**
	 * Collapses a field
	 * @param {fieldElement} fieldElement
	 * @returns {void}
	 */
	collapseField(fieldElement) {
		const icon = fieldElement.querySelector(`button[data-id="toggle"] > i`); //!BUG

		icon.classList.add("fa-eye");
		icon.classList.remove("fa-eye-slash");

		fieldElement.classList.remove("field--expanded");
	}

	/**
	 * Creates the HTML Structure of an field and returns it
	 * @param {field} field
	 * @returns {HTMLDivElement}
	 */
	createField(field) {
		const fieldElement = document.createElement("div");

		fieldElement.id = field.fieldId;
		fieldElement.classList.add("field");

		fieldElement.innerHTML = `
			<div class="field__head">
				<p class="field__type">
					${Fields.getIcon(field.type)} ${field.type}
				</p>
				<p class="field__id" ${
					Settings.get("hideFieldIds") ? `style="display: none"` : ""
				}>${field.fieldId}
				</p>
				<div class="field__controls">
					${
						field.attributes || field.options
							? `<button data-id="add" title="Add Subfield"><i class="fa-solid fa-plus"></i></button>`
							: ""
					}
					${
						field.attributes || field.options
							? `<button data-id="toggle" title="Expand/Collapse"><i class="fa-solid fa-eye"></i></button>`
							: ""
					}
					<button data-id="moveUp" title="Move Up"><i class="fa-solid fa-chevron-up"></i></button>
					<button data-id="moveDown" title="Move Down"><i class="fa-solid fa-chevron-down"></i></button>
					<button data-id="remove" title="Remove"><i class="fa-solid fa-close"></i></button>
				</div>
			</div>
			<div class="field__attributes"></div>
		`;

		return fieldElement;
	}

	/**
	 * Removes a field from the Editor
	 * @param {fieldElement}
	 */
	removeField(fieldElement) {
		const fieldId = fieldElement.id;

		Toolbar.reset();
		Fields.remove(fieldId);
		fieldElement.remove();
	}

	/**
	 * Adds EventListener to the Editor
	 */
	registerEvents() {
		this.editor.onclick = (e) => {
			const target = e.target;
			const field = target.closest(".field");

			if (!field) {
				this.unselectAllFields();
				Toolbar.reset();
			}
		};
	}
}

export default new Editor();
