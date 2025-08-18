import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import typescript from "vite-plugin-typescript";

export default defineConfig({
	plugins: [
		solidPlugin(),
		tailwindcss(),
		// Use TypeScript compiler for better const enum support
		process.env.NODE_ENV === "production"
			? typescript({
					compilerOptions: {
						preserveConstEnums: false,
						importsNotUsedAsValues: "remove",
					},
				})
			: null,
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
	esbuild: {
		// So that we can mangle class properties that start with an underscore
		mangleProps: /^_/,
	},
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src"),
		},
	},
});
