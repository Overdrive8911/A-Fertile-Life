export function capitalizeString<TString extends string>(
	str: TString,
): Capitalize<TString> {
	//@ts-expect-error this works
	return `${str[0]?.toLowerCase()}${str.slice(1)}`;
}

/** For converting a string to the numeric sum of its characters and indexes */
export function getUniqueNumberFromSumOfCharCodes(str: string) {
	let sum = 0;
	for (let i = 0, len = str.length; i < len; i++) {
		sum += str.charCodeAt(i) + i;
	}
	return sum;
}
