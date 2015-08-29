function tupify(obj) {
	var results = [];


	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			var arrTup = [];
			arrTup.push(key);
			if (typeof obj[key] === 'object') {
				tupify(obj[key]);
			} else {
				arrTup.push(obj[key]);
			}
			results.push(arrTup);

		} 
	}
	return results;

}