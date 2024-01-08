// Log FormData entries

export function logFormData(formData) {
    for (let [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`);
	}

}
