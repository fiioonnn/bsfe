class Fields {
	constructor() {
		this.types = {};
		this.fields = [];
		this.cache = {};
		this.icons = {};
	}

	/**
	 * Initializes the field cache
	 * @returns {void}
	 */
	initCache() {
		Object.keys(this.types).forEach((type) => {
			this.cache[type] = [];
		});
	}

	/**
	 * Add a new field to the provided target.
	 * If the targetId is null, the field gets
	 * appended to the fields array.
	 * @param {type} fieldType
	 * @param {targetId} fieldId
	 * @returns {field}
	 */
	add(type, targetId = null) {
		if (!this.types[type]) {
			throw new Error(`Invalid field type '${type}'`);
		}

		const field = JSON.parse(JSON.stringify(this.types[type]));
		const fieldId = this.generateID(type);

		field.fieldId = fieldId;
		!type.includes("Option") && (field.id = fieldId);
		field.type = type;
		field.switch && (field.switch = true);

		field.help && (field.help = "Lorem ipsum dolor sit amet.");
		field.title && (field.title = "Lorem ipsum dolor.");
		field.label && (field.label = "Label text.");
		field.name && (field.name = fieldId);

		this.cache[type].push(fieldId);

		if (targetId) {
			const targetField = this.find(targetId);
			const targetFieldId = targetField?.fieldId;
			let targetFieldAttrType = null;

			if (!targetField) {
				return console.error(`Field '${targetId}' not found`);
			}

			if (targetField.attributes) {
				targetFieldAttrType = "attributes";
			} else if (targetField.options) {
				targetFieldAttrType = "options";
			} else {
				return console.error(
					`Target field '${targetFieldId}' has no attributes or options property`
				);
			}

			targetField[targetFieldAttrType].push(field);
		} else {
			this.fields.push(field);
		}

		this.clearProps(fieldId);

		return field;
	}

	/**
	 * Returns the HTML Icon Element of a field
	 * @param {fieldType} type
	 * @returns {HTMLItalicElement}
	 */
	getIcon(type) {
		return `<i class="fa-solid ${this.icons[type]}"></i>`;
	}

	/**
	 * Update a field
	 * @param {fieldId} id
	 * @param {object} props
	 * @returns {field}
	 */
	update(id, props) {
		const field = this.find(id);

		if (!field) {
			return console.error(`Field '${id}' not found`);
		}

		for (let prop in props) {
			if (!field[prop]) {
				console.warn(`Property '${props[prop]}' does not exist but was added.`);
			}
			field[prop] = props[prop];
		}

		return field;
	}

	/**
	 * Removes an field
	 * @param {fieldId} id
	 * @returns {field}
	 */
	remove(id, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];
			if (this.cache[obj.type].includes(id)) {
				this.cache[obj.type].splice(this.cache[obj.type].indexOf(id), 1);
			}

			if (obj.fieldId === id) {
				return arr.splice(i, 1)[0];
			}

			if (obj.attributes && Array.isArray(obj.attributes)) {
				this.remove(id, obj.attributes);
			}

			if (obj.options && Array.isArray(obj.options)) {
				this.remove(id, obj.options);
			}
		}
	}

	/**
	 * Returns the field
	 * @param {fieldId} id
	 * @returns {field}
	 */
	find(id, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			if (obj.fieldId === id) {
				return obj;
			}

			// attributes[]
			if (obj.attributes && Array.isArray(obj.attributes)) {
				const result = this.find(id, obj.attributes);

				if (result) {
					return result;
				}
			}

			// options[]
			if (obj.options && Array.isArray(obj.options)) {
				const result = this.find(id, obj.options);

				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	/**
	 * Returns the parent of a field
	 * @param {fieldId} id
	 * @returns {field}
	 */
	findParent(id, arr = this.fields, parent = null) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			if (obj.fieldId === id) {
				return parent;
			}

			// attributes[]
			if (obj.attributes && Array.isArray(obj.attributes)) {
				const result = this.findParent(id, obj.attributes, obj);
				if (result) {
					return result;
				}
			}

			// options[]
			if (obj.options && Array.isArray(obj.options)) {
				const result = this.findParent(id, obj.options, obj);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	/**
	 * Returns the next sibling field
	 * @param {fieldId} id
	 * @returns {field}
	 */
	findNext(id, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			if (obj.fieldId === id && i < arr.length - 1) {
				return arr[i + 1];
			}

			// attributes[]
			if (obj.attributes && Array.isArray(obj.attributes)) {
				const result = this.findNext(id, obj.attributes);
				if (result) {
					return result;
				}
			}

			// options[]
			if (obj.options && Array.isArray(obj.options)) {
				const result = this.findNext(id, obj.options);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	/**
	 * Returns the previous sibling field
	 * @param {fieldId} id
	 * @returns {field}
	 */
	findPrevious(id, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			if (obj.fieldId === id && i > 0) {
				return arr[i - 1];
			}

			// attributes[]
			if (obj.attributes && Array.isArray(obj.attributes)) {
				const result = this.findPrevious(id, obj.attributes);
				if (result) {
					return result;
				}
			}

			// options[]
			if (obj.options && Array.isArray(obj.options)) {
				const result = this.findPrevious(id, obj.options);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	/**
	 * Finds the root parent of a field
	 * @param {fieldId} id
	 * @returns {fieldId}
	 */
	findRootParent(id, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			if (obj.fieldId === id && !this.findParent(id)) {
				return obj;
			}

			const parent = this.findParent(id);
			if (parent) {
				return this.findRootParent(parent.fieldId);
			}
		}

		return null;
	}

	/**
	 * Puts a field in anothers field attributes or options
	 * @param {fieldId} id
	 * @param {fieldId} targetId
	 * @returns {field}
	 */
	put(id, targetId) {
		const field = this.find(id);

		if (!field) {
			return console.error(`Field '${id}' not found`);
		}

		if (!targetId) {
			this.remove(id);
			const copy = { ...field };
			this.fields.push(copy);
			return copy;
		}

		const targetField = this.find(targetId);
		let targetFieldAttrType = null;

		if (!targetField) {
			return console.error(`Field '${targetId}' not found`);
		}

		if (targetField.attributes) {
			targetFieldAttrType = "attributes";
		} else if (targetField.options) {
			targetFieldAttrType = "options";
		} else {
			throw new Error(
				`Target field '${targetId}' has no attributes or options property`
			);
		}

		this.remove(id);
		const copy = { ...field };
		targetField[targetFieldAttrType].push(copy);

		return targetField;
	}

	/**
	 * Moves a field up or down
	 * @param {fieldId} id
	 * @param {dir} direction
	 */
	move(id, dir) {
		const field = this.find(id);
		const parent = this.findParent(id);
		const target = dir === "up" ? this.findPrevious(id) : this.findNext(id);

		if (!field || !target) {
			return;
		}

		let index = {
			field: this.fields.indexOf(field),
			target: this.fields.indexOf(target),
		};
		let arr = this.fields;

		if (parent) {
			const parentAttrType = parent.options ? "options" : "attributes";

			index = {
				field: parent[parentAttrType].indexOf(field),
				target: parent[parentAttrType].indexOf(target),
			};

			arr = parent[parentAttrType];
		}

		arr[index.field] = target;
		arr[index.target] = field;
	}

	/**
	 * Clears all properties of a field
	 * @param {fieldId|object} id
	 * @returns {field}
	 */
	clearProps(id) {
		let field = null;

		if (typeof id === "string") {
			field = this.find(id);
		} else {
			field = id;
		}

		if (!field) {
			return console.error(`Field '${id}' not found`);
		}

		for (let prop in field) {
			if (
				prop === "fieldId" ||
				prop === "type" ||
				prop === "id" ||
				prop === "help" ||
				prop === "title" ||
				prop === "label" ||
				prop === "switch" ||
				prop === "name"
			)
				continue;

			if (field[prop] === "string") {
				field[prop] = "";
				continue;
			}

			if (field[prop] === "number") {
				field[prop] = 0;
				continue;
			}

			if (field[prop] === "boolean") {
				field[prop] = false;
				continue;
			}

			if (Array.isArray(field[prop])) {
				if (prop === "returnFormat") {
					field[prop] = field[prop][0];
					return;
				}

				if (field[prop][0]) {
					field[prop] = [field[prop][0]];
				}

				continue;
			}

			if (typeof field[prop] === "object" && !Array.isArray(field[prop])) {
				this.clearProps(field[prop]);
				continue;
			}

			field[prop] = null;
		}

		return field;
	}

	/**
	 * Loops through each field in the fields array
	 * @param {function} callback
	 * @returns {*}
	 */
	each(callback, arr = this.fields) {
		for (let i = 0; i < arr.length; i++) {
			const obj = arr[i];

			callback(obj);

			if (obj.attributes && Array.isArray(obj.attributes)) {
				this.each(callback, obj.attributes);
			}

			if (obj.options && Array.isArray(obj.options)) {
				this.each(callback, obj.options);
			}
		}
	}

	/**
	 * Random string generator
	 * @param {number} length
	 * @returns {string}
	 */
	randomString(length) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}
		return result;
	}

	/**
	 * Generates and returns the field id
	 * @param {fieldType} type
	 * @returns {field}
	 */
	generateID(type) {
		return `${type}_${this.randomString(8)}`;
	}
}

export default new Fields();

// import History from "./history.js";
// import Alert from "./alerts.js";
// import Settings from "./settings.js";
// import Toolbar from "./toolbar.js";
// import { convertToType } from "./utils.js";

// class Fields {
// 	constructor(params) {
// 		this.fields = [];
// 		this.fieldTypes = {
// 			checkbox: {
// 				id: "text",
// 				label: "text",
// 				amount: "number",
// 				options: [
// 					{
// 						value: "text",
// 						label: "text",
// 					},
// 				],
// 			},
// 			group: {
// 				id: "text",
// 				title: "text",
// 				initialOpen: "boolean",
// 				attributes: [],
// 			},
// 			wysiwyg: {
// 				test: ["first", "second", "third"],
// 				id: "text",
// 				label: "text",
// 				attributes: {
// 					text: {
// 						label: "text",
// 						name: "text",
// 					},
// 				},
// 				colors: {
// 					options: [
// 						{
// 							name: "text",
// 							label: "text",
// 						},
// 					],
// 				},
// 				toolbar: {
// 					tags: {
// 						headings: [1, 2, 3, 4, 5, 6],
// 					},
// 					formats: {
// 						bold: "boolean",
// 						italic: "boolean",
// 						underline: "boolean",
// 						strikethrough: "boolean",
// 						code: "boolean",
// 						orderedList: "boolean",
// 						unorderedList: "boolean",
// 						link: {
// 							opensInNewTab: "boolean",
// 							attributes: {
// 								rel: "select",
// 							},
// 						},
// 					},
// 				},
// 			},
// 		};
// 		this.fieldCache = {
// 			checkbox:
// 		};
// 		this.selectedFieldId = null;
// 		this.fieldIcons = {
// 			checkbox: "fa-solid fa-check-square",
// 			group: "fa-solid fa-object-group",
// 		};
// 	}

// 	/**
// 	 * Renders the fields array inside the field settings (toolbar)
// 	 * @param {string} fieldType
// 	 * @returns {null} null
// 	 */
// 	select(fieldId) {
// 		const field = this.find(fieldId);

// 		this.selectedFieldId = fieldId;

// 		// Clear the field settings inside the toolbar
// 		$("#fieldSettings").empty();
// 		$("#fieldSettingsId")
// 			.css({
// 				display: "flex",
// 			})
// 			.text(fieldId);

// 		// Highlight the selected field
// 		$("#fields > .field").removeClass("field--active");
// 		$(`#${field.fieldId}`).addClass("field--active");

// 		let input = "";
// 		let inputType = "input";

// 		Object.entries(this.fieldTypes[field.type]).forEach(([key, value]) => {
// 			if (key === "fieldId" || key === "type" || key === "attributes") return;

// 			if (value === "text") {
// 				input = `
// 					<span>${key}</span>
// 					<input type="text" name="${key}" value="${field[key]}">
// 				`;
// 			}

// 			if (value === "number") {
// 				input = `
// 					<span>${key}</span>
// 					<input type="number" name="${key}" value="${field[key]}">
// 				`;
// 			}

// 			if (value === "boolean") {
// 				inputType = "checkbox";
// 				input = `
// 					<span>${key}</span>
// 					<input type="checkbox" name="${key}" >
// 				`;
// 			}

// 			if (typeof value === "object") {
// 				inputType = "select";
// 				input = `
// 					<span>${key}</span>
// 					<select name="${key}">
// 						${value.map((option) => `<option value="${option}">${option}</option>`)}
// 					</select>
// 				`;
// 			}

// 			$("#fieldSettings").append(`
// 				<li class="nav__item nav__item--input">
// 					<label class="${inputType}">
// 						${input}
// 					</label>
// 				</li>
// 			`);
// 		});
// 	}

// 	/**
// 	 * Save the field settings
// 	 */
// 	save() {
// 		const field = this.find(this.selectedFieldId);

// 		if (!field) return;

// 		const fieldSettings = $("#fieldSettings");
// 		const formData = new FormData(fieldSettings[0]);

// 		const data = {};

// 		if (formData.get("active") === "on") {
// 			formData.append("active", true);
// 		} else {
// 			formData.append("active", false);
// 		}

// 		console.log(formData.getAll("active"));

// 		for (let pair of formData.entries()) {
// 			console.log(pair[0], pair[1]);
// 			data[pair[0]] = convertToType(pair[1]);
// 		}

// 		this.update(this.selectedFieldId, data);

// 		console.log(JSON.stringify(this.fields, null, 4));
// 	}

// 	/**
// 	 * Clears the field settigns
// 	 */
// 	unselect() {
// 		$("#fieldSettings").empty();
// 		$("#fieldSettingsId").hide();
// 		this.selectedFieldId = null;
// 	}

// 	/**
// 	 * Clears the values of a field
// 	 * @param {string} fieldId
// 	 */
// 	clear(fieldId) {
// 		const field = this.find(fieldId);

// 		if (!field) return;

// 		for (let prop in field) {
// 			if (prop === "fieldId" || prop === "type" || prop === "attributes")
// 				continue;

// 			if (field[prop] === "boolean") {
// 				field[prop] = false;
// 				continue;
// 			}

// 			if (field[prop] === "number") {
// 				field[prop] = 0;
// 				continue;
// 			}

// 			if (typeof field[prop] === "object") {
// 				field[prop] = field[prop][0];
// 				continue;
// 			}

// 			if (typeof field[prop] === "string") {
// 				field[prop] = "";
// 				continue;
// 			}

// 			field[prop] = "";
// 		}
// 	}

// 	/**
// 	 * Adds a field to the fields array
// 	 * @param {string} fieldType
// 	 * @param {string} parentId fieldId
// 	 * @returns {string} fieldId
// 	 */
// 	add(fieldType) {
// 		const fieldId = this.generateId(fieldType);

// 		if (!this.fieldTypes[fieldType])
// 			return console.error(`Field ${fieldType} type does not exist`);

// 		this.fields.push({
// 			fieldId,
// 			type: fieldType,
// 			...this.fieldTypes[fieldType],
// 		});

// 		// History
// 		History.add({
// 			text: `Added field: ${fieldId}`,
// 		});

// 		// Render the field
// 		this.render(fieldId);
// 		// Add controls to the field
// 		this.addControls(fieldId);
// 		// Clear the field settings
// 		this.clear(fieldId);
// 		// Select the field
// 		this.select(fieldId);

// 		return fieldId;
// 	}

// 	addSubfield(fieldType, parentId) {
// 		const fieldId = this.generateId(fieldType);
// 		const parentField = this.find(parentId);

// 		if (!parentField) return;

// 		if (!this.fieldTypes[fieldType])
// 			return console.error(`Field ${fieldType} type does not exist`);

// 		parentField.attributes.push({
// 			fieldId,
// 			type: fieldType,
// 			...this.fieldTypes[fieldType],
// 		});

// 		// History
// 		History.add({
// 			text: `Added field: ${fieldId} to ${parentId}`,
// 		});

// 		// Render the field
// 		this.render(fieldId, `#${parentId} .field__attributes`);
// 		// Add controls to the field
// 		this.addControls(fieldId);
// 		// Clear the field settings
// 		this.clear(fieldId);
// 		// Select the field
// 		this.select(fieldId);

// 		return fieldId;
// 	}

// 	/**
// 	 * Adds controls to the field
// 	 * @param {string} fieldType
// 	 */
// 	addControls(fieldId) {
// 		const field = this.find(fieldId);

// 		if (!field) return;

// 		// Main controls (up, down, delete)
// 		$(`#${field.fieldId}`).on("click", (e) => {
// 			if ($(e.target).is("i") || $(e.target).is("button")) {
// 				const button = $(e.target).closest("button");
// 				const buttonFunction = button.attr("data-id");

// 				if (buttonFunction === "moveUp") {
// 					console.log("Move up");
// 				}

// 				if (buttonFunction === "moveDown") {
// 					console.log("Move down");
// 				}

// 				if (buttonFunction === "delete") {
// 					this.delete(fieldId);
// 				}
// 				return;
// 			}

// 			this.select(fieldId);
// 		});

// 		// Add field button control
// 		$(`#${fieldId}`)
// 			.find(".field__add")
// 			.on("click", () => {
// 				Toolbar.set("addFieldsTo", fieldId);
// 				Toolbar.closeAllMenus();
// 				setTimeout(() => {
// 					Toolbar.openMenu("addFields");
// 				}, 100);
// 			});
// 	}

// 	/**
// 	 * Renders and appends the field to the given element
// 	 * @param {string} fieldType
// 	 * @param {string} element
// 	 */
// 	render(fieldId, element = "#fields") {
// 		const field = this.find(fieldId);
// 		const container = $(element);
// 		const fieldHTML = `
// 			<div class="field" id="${field.fieldId}">
// 				<div class="field__head">
// 					<p class="field__type">
// 						<i class="fa-solid ${this.fieldIcons[field.type]}"></i>
// 						${field.type}
// 					</p>
// 					<p class="field__id" ${
// 						Settings.get("hideFieldIds") ? `style="display: none"` : ""
// 					}>${field.fieldId}</p>
// 					<div class="field__controls">
// 						<button data-id="moveUp"><i class="fa-solid fa-chevron-up"></i></button>
// 						<button data-id="moveDown"><i class="fa-solid fa-chevron-down"></i></button>
// 						<button data-id="delete"><i class="fa-solid fa-close"></i></button>
// 					</div>
// 				</div>
// 				${
// 					field.attributes
// 						? `
// 						<div class="field__attributes">
// 							<button class="field__add">
// 								<i class="fa-solid fa-plus"></i> Add field
// 							</button>
// 						</div>`
// 						: ``
// 				}
// 			</div>
// 		`;

// 		if (!field) return;

// 		container.append(fieldHTML);
// 	}

// 	/**
// 	 * Finds an field in the fields array and returns it.
// 	 * @param {string} fieldId
// 	 * @returns {object} The field
// 	 */
// 	find(fieldId) {
// 		return this.searchArray(this.fields, fieldId) || null;
// 	}

// 	/**
// 	 * Update the properties of an field
// 	 * @param {string} fieldId
// 	 * @param {object} props
// 	 * @returns {object} The updated field
// 	 */
// 	update(fieldId, props) {
// 		const field = this.find(fieldId);

// 		if (!field) return;

// 		for (let prop in props) {
// 			field[prop] = props[prop];
// 		}

// 		// History
// 		History.add({
// 			text: `Updated field: ${fieldId}`,
// 		});

// 		return field;
// 	}

// 	/**
// 	 * Deletes an field from the fields array
// 	 * @param {string} fieldId
// 	 * @returns {boolean}
// 	 */
// 	delete(fieldId) {
// 		const field = this.find(fieldId);

// 		if ($(`#${fieldId}`).hasClass("field--active")) {
// 			this.unselect();
// 		}

// 		$("#" + fieldId).remove();

// 		// Show alert
// 		Alert.create({
// 			type: "info",
// 			message: `Deleted field: ${fieldId}`,
// 		});

// 		// History
// 		History.add({
// 			text: `Deleted field: ${fieldId}`,
// 		});

// 		this.removeFromArray(this.fields, fieldId);
// 	}

// 	/**
// 	 * Searches an field in an array of fields
// 	 */
// 	searchArray(arr, fieldId) {
// 		for (let obj of arr) {
// 			if (obj.fieldId === fieldId) {
// 				return obj;
// 			}

// 			if (obj.attributes) {
// 				const result = this.searchArray(obj.attributes, fieldId);
// 				if (result) {
// 					return result;
// 				}
// 			}
// 		}

// 		return null;
// 	}

// 	/**
// 	 * Removes an field from an array of fields
// 	 */
// 	removeFromArray(arr, fieldId) {
// 		for (let i = 0; i < arr.length; i++) {
// 			if (arr[i].fieldId === fieldId) {
// 				arr.splice(i, 1);
// 				return true;
// 			}

// 			if (arr[i].attributes) {
// 				const result = this.removeFromArray(arr[i].attributes, fieldId);
// 				if (result) {
// 					return result;
// 				}
// 			}
// 		}

// 		return false;
// 	}

// 	/**
// 	 * Counts the number of fields of a certain type
// 	 */
// 	countFields(arr, fieldType) {
// 		// stringify the array
// 		// count the number of obj.type === fieldType

// 		let count = 0;

// 		for (let obj of arr) {
// 			if (obj.type === fieldType) {
// 				count++;
// 			}

// 			if (obj.attributes && obj.attributes.length > 0) {
// 				count += this.countFields(obj.attributes, fieldType);
// 			}
// 		}

// 		return count;
// 	}

// 	/**
// 	 * Generates an id for a field based on the field type
// 	 * and the count of fields of that type
// 	 * @param {string} fieldType
// 	 * @returns {string} fieldId
// 	 */
// 	generateId(fieldType) {
// 		const count = this.countFields(this.fields, fieldType);
// 		return `${fieldType}_${count + 1}`;
// 	}
// }

// export default new Fields();
