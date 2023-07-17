import Editor from "./editor.class.js";
import Fields from "./fields.class.js";

class Conditions {
	constructor() {}

	open(fieldId) {}

	close(fieldId) {}

	get(fieldId) {}

	set(fieldId, conditions) {}

	add(fieldId, condition, type = "and") {
		const field = Fields.find(fieldId);
		const conditions = field?.conditions;

		if (!conditions)
			throw new Error(`Field '${fieldId}' does not accept conditions.`);

		conditions.and = [];
	}
}

export default new Conditions();
