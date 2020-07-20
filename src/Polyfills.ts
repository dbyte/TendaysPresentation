interface ObjectConstructor {
	/** 
	 * Polyfill for clients < ES7.
	 * Extends the Object class to convert a name:value object to an array of value.
	*/
	values<T>(source: any): T[];
}

if (!Object.values) {

	/**
	 * Extends the Object class to convert a name:value object to an array of value
	 * @param source
	 * @returns {T[]}
	 */
	Object.values = function <T>(source: any): T[] {
		const result = Object.keys(source).map(x => source[x]);
		console.log("Polyfill called")
		return result;
	}
}
