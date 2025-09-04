import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solidPlugin from "vite-plugin-solid";
import typescript from "vite-plugin-typescript";

export default defineConfig({
	plugins: [
		solidPlugin(),
		tailwindcss(),
		// Use TypeScript compiler for better const enum support
		process.env["NODE_ENV"] === "production" ? typescript() : null,
		viteSingleFile(),

		{
			name: "force-full-reload-on-change",
			handleHotUpdate({ server }) {
				server.ws.send({ type: "full-reload" });
				return [];
			},
		},
	],
	server: {
		port: 3003,
	},
	build: {
		target: "esnext",
		minify: "terser",
		terserOptions: { mangle: { properties: { regex: /^_/ } } },
	},
	// esbuild: {
	// 	// So that we can mangle class properties that start with an underscore
	// 	mangleProps: /^_/,
	// },
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src"),
		},
	},
});
