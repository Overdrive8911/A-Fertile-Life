export function capitalizeString<TString extends string>(
	str: TString,
): Capitalize<TString> {
	//@ts-expect-error this works
	return `${str[0]?.toLocaleUpperCase()}${str.slice(1)}`;
}
