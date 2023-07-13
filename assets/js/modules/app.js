class App {
	constructor() {
		this.fields = [];
		this.fieldTypes = {
			text: {
				name: "text",
				label: "text",
			},
			group: {
				name: "text",
				label: "text",
				attributes: [],
			},
		};
		this.fieldCache = {};
	}

	generateFieldCache() {
		Object.keys(this.fieldTypes).forEach((fieldType) => {
			this.fieldCache[fieldType] = [];
		});
	}

	// Adds a new field
	addField(fieldType, target = null) {
		const field = this.fieldTypes[fieldType];

		if (!field) return console.log("Invalid FieldType at 'addField()'");
	}

	// Finds a field by its id
	findField(fieldId) {}

	// Removes a field
	removeField(fieldId) {}

	// Updates a field
	updateField(fieldId, fieldData) {}
}

export default new App();

/*

Example attributes:

[
	{
		fieldId: "text-1"
		type: "text",
		label: "Text",
	},
	{
		fieldId: "group-1"
		type: "group",
		label: "Group",
		attributes: [
			{
				fieldId: "text-2"
				type: "text",
				label: "Text",
			},
			{
				fieldId: "text-3"
				type: "text",
				label: "Text",
			},
			{
				fieldId: "group-1"
				type: "group",
				label: "Group",
				attributes: [
					{
						fieldId: "text-4"
						type: "text",
						label: "Text",
					},
			}
		]
	}
]

*/
