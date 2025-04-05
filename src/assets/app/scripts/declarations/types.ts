export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

/**
 * Stuff like `$var`, `$var.foo`, `_var.foo[bar]`
 */
export type SugarcubeVariable = `$${string}` | `_${string}` | `setup.${string}`;
