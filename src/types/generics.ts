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

export type ExtractTypeFromAsyncGenerator<
	TAsyncGenerator extends AsyncGenerator,
> = TAsyncGenerator extends AsyncGenerator<infer TData, unknown, unknown>
	? TData
	: never;

/** In cases where you want an array of all the values from the enum */
export type EnumToArray<TEnum extends string | number | symbol> = readonly [
	TEnum,
	...TEnum[],
] & {
	[K in TEnum]: TEnum;
};

/** Brand type for creating nominal types */
export type Brand<T, TBrand> = T & { readonly __brand: TBrand };

/** Type-level satisfies that ensures `TActualType` satisfies the constraint `TTypeToBeSatisfied` while preserving `TActualType`'s specific type */
export type Satisfies<
	TActualType extends TTypeToBeSatisfied,
	TTypeToBeSatisfied,
> = TActualType;
