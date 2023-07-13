import Fields from "./fields.class.js";

class FieldSettings {
	constructor() {
		this.fieldSettings = document.querySelector("#fieldSettings");
		this.fieldSettingsId = document.querySelector("#fieldSettingsId");
	}

	/**
	 * Selects a field and renders its properties
	 * to the field settings panel.
	 * @param {fieldId} fieldId
	 * @returns {void}
	 */
	open(fieldId) {
		const field = Fields.find(fieldId);
		const fieldType = Fields.types[field.type];

		this.fieldSettings.innerHTML = this.createInputs(field, fieldType);
		this.setTitle(fieldId, true);
		this.registerInputs();
	}

	/**
	 * Closes the fieldSettings.
	 * @returns {void}
	 */
	close() {
		this.fieldSettings.innerHTML = "";
		this.setTitle();
		this.unregisterInputs();
	}

	/**
	 * Sets the title of the fieldSettings.
	 * @param {text} text
	 * @param {show} show
	 * @returns {void}
	 */
	setTitle(text = "N/A", show = false) {
		this.fieldSettingsId.innerHTML = text;
		this.fieldSettingsId.style.opacity = show ? "1" : "0";
	}

	/**
	 * Registers the input events.
	 * This is used to save the field settings.
	 * @returns {void}
	 */
	registerInputs() {
		const field = Fields.find(this.fieldSettingsId.innerHTML);
		const inputs = Array.from(
			this.fieldSettings.querySelectorAll("input, select")
		);

		inputs.forEach((input) => {
			input.onchange = (e) => {
				if (input.type === "checkbox") {
					this.setValue(field, input.name, input.checked);
				}

				if (input.type === "number") {
					this.setValue(field, input.name, parseInt(input.value));
				}

				if (input.type === "text") {
					this.setValue(field, input.name, input.value);
				}

				if (input.type === "select-multiple") {
					const options = Array.from(input.options);
					const selected = options.filter((option) => option.selected);
					const values = selected.map((option) => option.value);

					return this.setValue(field, input.name, values);
				}

				if (input.type === "select-one") {
					console.log(12312312313);
					this.setValue(field, input.name, input.value);
				}
				// this.setValue(field, nameString, input.value, input.name);
			};
		});
	}

	/**
	 * Unregisters the input events.
	 * Prevents memory leaks.
	 * @returns {void}
	 */
	unregisterInputs() {
		const inputs = Array.from(
			this.fieldSettings.querySelectorAll("input, select")
		);

		inputs.forEach((input) => {
			input.onchange = null;
		});
	}

	/**
	 * Creates the fields based on the fieldType.
	 * @param {field} field
	 * @param {fieldType} fieldType
	 * @returns {HTMLLIElement} output
	 */
	createInputs(field, fieldType) {
		let output = "";
		let multiSelects = ["headings"];
		let ignore = ["fieldId", "options"];

		const generate = (obj, path = "") => {
			Object.entries(obj).forEach(([key, value]) => {
				const inputName = path + key;
				const inputValue = this.getValue(field, inputName, key);
				let inputHTML = "";
				let inputType = "";

				if (ignore.includes(key)) return;

				if (key === "attributes" && Array.isArray(value)) {
					return;
				}

				if (value === "string") {
					inputType = "string";
					inputHTML = `<input type="text" name="${inputName}" value="${inputValue}">`;
				}

				if (value === "number") {
					inputType = "number";
					inputHTML = `<input type="number" name="${inputName}" value="${inputValue}">`;
				}

				if (value === "boolean") {
					inputType = "boolean";
					inputHTML = `<input type="checkbox" name="${inputName}" ${
						inputValue ? "checked" : ""
					}>`;
				}
				if (Array.isArray(value)) {
					console.log(inputName, inputValue);
					inputType = "select";
					inputHTML = `<select name="${inputName}" ${
						multiSelects.includes(key) ? "multiple" : ""
					}>`;

					if (Array.isArray(inputValue)) {
						value.forEach((option) => {
							console.log(option);
							inputHTML += `<option value="${option}" ${
								inputValue.includes(option.toString()) ? "selected" : ""
							}>${option}</option>`;
						});
					} else {
						value.forEach((option) => {
							inputHTML += `<option value="${option}" ${
								inputValue === option ? "selected" : ""
							}>${option}</option>`;
						});
					}

					inputHTML += `</select>`;
				}

				// Key has objects
				if (typeof value === "object" && !Array.isArray(value)) {
					let outputText = path + key;
					outputText = outputText.replace(/:/g, " » ");

					output += `<li class="nav__item nav__item--nested">${outputText}</li>`;
					return generate(value, path + key + ":");
				}

				output += `
					<li class="nav__item nav__item--input">
						<label class="${inputType}">
							<span>${key}</span>
							${inputHTML}
						</label>
					</li>
				`;
			});
		};

		generate(fieldType);

		return output;
	}

	setValue(field, nameString, value) {
		const keys = nameString?.split(":");

		// resolve the nameString to the correct object and set the value use Fields.update()
		if (nameString?.trim() !== "") {
			let result = field;

			for (let i = 0; i < keys.length; i++) {
				if (i === keys.length - 1) {
					result[keys[i]] = value;
				} else {
					result = result[keys[i]];
				}
			}
		} else {
			field[nameString] = value;
		}

		console.log(JSON.stringify(field, null, 2));
	}

	getValue(field, query, key) {
		let fieldKeys = query.split(":");
		let result = field;

		if (query.trim() !== "") {
			for (let i = 0; i < fieldKeys.length; i++) {
				if (i === fieldKeys.length - 1) {
					return result[fieldKeys[i]];
				} else {
					result = result[fieldKeys[i]];
				}
			}
		}

		return result[key];
	}

	getKeys(field, nameString) {
		const props = nameString?.split(":");

		let result = field;

		if (nameString?.trim() !== "") {
			for (let prop of props) {
				result = result[prop];
			}
		}

		// Return the value for the giv
		return Object.keys(result);
	}
}

export default new FieldSettings();
//
//
//
//

// import Fields from "./fields.class.js";

// class FieldSettings {
// 	constructor() {
// 		this.fieldSettings = document.querySelector("#fieldSettings");
// 		this.fieldSettingsId = document.querySelector("#fieldSettingsId");
// 	}

// 	/**
// 	 * Set the title of the fieldSettings
// 	 * @param {fieldId} fieldId
// 	 */
// 	setTitle(fieldId) {
// 		this.fieldSettingsId.style.opacity = "1";
// 		this.fieldSettingsId.innerHTML = fieldId;
// 	}

// 	/**
// 	 * Selects a field
// 	 * @param {fieldId} fieldId
// 	 */
// 	select(fieldId) {
// 		this.setTitle(fieldId);
// 		this.render(fieldId);
// 		this.addInputEvents(fieldId);
// 	}

// 	render(fieldId) {
// 		const field = Fields.find(fieldId);
// 		const fieldType = Fields.types[field.type];

// 		this.fieldSettings.innerHTML = this.getInputs(field.fieldId, fieldType);
// 	}

// 	getInputs(fieldId, obj) {
// 		let field = Fields.find(fieldId);
// 		let output = "";
// 		let labelClass = "";
// 		let multipleSelects = ["headings"];

// 		const generate = (obj) => {
// 			Object.entries(obj).forEach(([key, value]) => {
// 				let inputHTML = "";

// 				if (value === "string") {
// 					labelClass = "string";
// 					inputHTML = `<input type="text" name="${key}" value="${field[key]}">`;
// 				}

// 				if (value === "number") {
// 					labelClass = "number";
// 					inputHTML = `<input type="number" name="${key}" value="${field[key]}">`;
// 				}

// 				if (value === "boolean") {
// 					labelClass = "boolean";
// 					inputHTML = `<input type="checkbox" name="${key}" ${
// 						field[key] ? "checked" : null
// 					}>`;
// 				}

// 				if (typeof value === "object" && !Array.isArray(value)) {
// 					labelClass = "object";
// 					output += `<li class="nav__item nav__item--nested">${key}</li>`;
// 					return generate(value);
// 				}

// 				if (Array.isArray(value)) {
// 					labelClass = "select";
// 					inputHTML = `<select name="${key}" ${
// 						multipleSelects.includes(key) ? "multiple" : null
// 					}>`;

// 					value.forEach((option) => {
// 						inputHTML += `<option value="${option}">${option}</option>`;
// 					});

// 					inputHTML += `</select>`;
// 				}

// 				output += `
// 					<li class="nav__item nav__item--input">
// 						<label class="${labelClass}">
// 							<span>${key}</span>
// 							${inputHTML}
// 						</label>
// 					</li>
// 				`;
// 			});
// 		};

// 		generate(obj);

// 		return output;
// 	}

// 	/*
// 	{
//   "title": "WYSIWYG field",
//   "blockstudio": {
//     "attributes": [
//       {
//         "id": "wysiwyg",
//         "type": "wysiwyg",
//         "label": "WYSIWYG",
//         "toolbar": {
//           "formats": {
//             "bold": true,
//             "italic": true,
//             "underline": true,
//             "strikethrough": true,
//             "code": true,
//             "orderedList": true,
//             "unorderedList": true,
//             "link": {
//               "opensInNewTab": true,
//               "attributes": {
//                 "rel": "nofollow"
//               }
//             }
//           }
//         }
//       }
//     ]
//   }
// }
// 	*/

// 	/**
// 	 * Closes the fieldSettings
// 	 * @returns {void}
// 	 */
// 	close() {
// 		this.fieldSettings.innerHTML = "";
// 		this.fieldSettingsId.style.opacity = "0";
// 		this.fieldSettingsId.innerHTML = "N/A";
// 	}

// 	save() {
// 		const field = Fields.find(this.fieldSettingsId.innerHTML);

// 		console.log(field);
// 	}

// 	addInputEvents(fieldId) {
// 		this.removeInputEvents();

// 		const field = Fields.find(fieldId);
// 		const fieldInputs = Array.from(
// 			this.fieldSettings.querySelectorAll("input, select")
// 		);

// 		fieldInputs.forEach((input) => {
// 			const key = input.name;

// 			input.onchange = (e) => {
// 				if (input.type === "checkbox") {
// 					return (field[key] = input.checked ? true : false);
// 				}

// 				field[key] = input.value;
// 			};
// 		});
// 	}

// 	removeInputEvents() {
// 		const fieldInputs = Array.from(
// 			this.fieldSettings.querySelectorAll("input, select")
// 		);

// 		fieldInputs.forEach((input) => {
// 			input.onchange = null;
// 		});
// 	}

// 	// //! NEW
// 	// renderInputs(fieldId) {
// 	// 	const field = Fields.find(fieldId);
// 	// 	const fieldType = Fields.types[field.type];

// 	// 	this.fieldSettings.innerHTML = this.generateInputs(fieldId, fieldType);
// 	// 	this.setTitle(field.fieldId);
// 	// }
// 	// //! NEW - END

// 	// generateInputs(fieldId, obj = {}) {
// 	// 	const field = Fields.find(fieldId);
// 	// 	let ignore = ["attributes", "fieldId", "options"];
// 	// 	let isMultiple = ["headings"];
// 	// 	let output = "";
// 	// 	let parentObject = "";

// 	// 	function test(obj = {}) {
// 	// 		console.log(field);

// 	// 		Object.entries(obj).forEach(([key, value]) => {
// 	// 			if (ignore.includes(key)) return;

// 	// 			let input = "";
// 	// 			let inputType = "";

// 	// 			// Text Input
// 	// 			if (value === "string") {
// 	// 				inputType = "text";
// 	// 				input = `<input type="text" name="${parentObject + key}" value="${
// 	// 					field[key]
// 	// 				}">`;
// 	// 			}

// 	// 			// Number Input
// 	// 			if (value === "number") {
// 	// 				inputType = "number";
// 	// 				input = `<input type="number" name="${parentObject + key}" value="${
// 	// 					field[key]
// 	// 				}">`;
// 	// 			}

// 	// 			// Checkbox Input
// 	// 			if (value === "boolean") {
// 	// 				inputType = "checkbox";
// 	// 				input = `<input type="checkbox" name="${parentObject + key}" value="${
// 	// 					field[key]
// 	// 				}">`;
// 	// 			}

// 	// 			if (typeof value === "object" && !Array.isArray(value)) {
// 	// 				output += `<li class="nav__item nav__item--nested">${key}</li>`;
// 	// 				return test(value);
// 	// 			}

// 	// 			// Select Input
// 	// 			if (Array.isArray(value)) {
// 	// 				inputType = "select";
// 	// 				input = `<select name="${parentObject + key}" value="${field[key]}" ${
// 	// 					isMultiple.includes(key) ? "multiple" : null
// 	// 				}>`;

// 	// 				value.forEach((option) => {
// 	// 					input += `<option value="${option}" ${
// 	// 						field[key] ? "selected" : null
// 	// 					}>${option}</option>`;
// 	// 				});

// 	// 				input += `</select>`;
// 	// 			}

// 	// 			output += `
// 	// 				<li class="nav__item nav__item--input">
// 	// 					<label class="${inputType}">
// 	// 						<span>${key}</span>
// 	// 						${input}
// 	// 					</label>
// 	// 				</li>
// 	// 			`;
// 	// 		});
// 	// 		output += `</div>`;
// 	// 	}

// 	// 	test(obj);

// 	// 	return output;
// 	// }

// 	// generateInput(key, value) {
// 	// 	let input = "";
// 	// 	let inputType = "";

// 	// 	// Text Input
// 	// 	if (value === "string") {
// 	// 		inputType = "text";
// 	// 		input = `<input type="text" name="${key}">`;
// 	// 	}

// 	// 	// Number Input
// 	// 	if (value === "number") {
// 	// 		inputType = "number";
// 	// 		input = `<input type="number" name="${key}">`;
// 	// 	}

// 	// 	// Checkbox Input
// 	// 	if (value === "boolean") {
// 	// 		inputType = "checkbox";
// 	// 		input = `<input type="checkbox" name="${key}">`;
// 	// 	}

// 	// 	// Select Input
// 	// 	if (Array.isArray(value)) {
// 	// 		inputType = "select";
// 	// 		input = `<select name="${key}">`;

// 	// 		value.forEach((option, i) => {
// 	// 			input += `<option value="${option}">${option}</option>`;
// 	// 		});

// 	// 		input += `</select>`;
// 	// 	}

// 	// 	return `
// 	// 		<li class="nav__item nav__item--input">
// 	// 			<label class="${inputType}">
// 	// 				<span>${key}</span>
// 	// 				${input}
// 	// 			</label>
// 	// 		</li>
// 	// 	`;
// 	// }
// }

// export default new FieldSettings();
