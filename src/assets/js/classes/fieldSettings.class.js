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

		console.log(fieldType);
	}

	/**
	 * Closes the fieldSettings.
	 * @returns {void}
	 */
	close() {}
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
