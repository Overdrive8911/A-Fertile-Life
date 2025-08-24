/** biome-ignore-all lint/complexity/noBannedTypes: <generics> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <generics> */
export type NonFunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type NumberKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type PublicDataProperties<T> = {
	[K in keyof T]: T[K] extends Function
		? never
		: T[K] extends (...args: any[]) => any
			? never
			: K;
}[keyof T];

export type ExtractDataProperties<T> = Pick<T, PublicDataProperties<T>>;
