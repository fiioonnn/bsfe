function searchField(arr, fieldId) {
	for (let obj of arr) {
		if (obj.fieldId === fieldId) {
			return obj;
		}

		if (obj.attributes) {
			const result = searchArray(obj.attributes, fieldId);
			if (result) {
				return result;
			}
		}
	}

	return null;
}

export { searchField, cout };
