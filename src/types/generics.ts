export type NonFunctionKeys<T> = {
	// biome-ignore lint/complexity/noBannedTypes: <TODO>
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type NumberKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
