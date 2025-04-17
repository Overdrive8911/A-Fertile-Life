import { build, write, $, sleep, type BuildConfig, serve } from "bun";
import {
	bundleScriptAndStyleExtensions,
	cleanDirectories,
	copyAssets,
	copyOtherAssets,
	scssToCss,
} from "./.build/plugins";
import { mode } from "./.build/variables";
import { Directory } from "./.build/enums";
import watcher from "@parcel/watcher";
import { setupTweego } from "tweenode";
import { existsSync, symlinkSync } from "fs-extra";

const buildConfig: BuildConfig = {
	entrypoints: [Directory.SCRIPT_ENTRYPOINT + ""],
	outdir: Directory.BUNDLED_SCRIPTS_DIR + "",
	minify: mode === "production",
	plugins:
		mode == "production"
			? [
					cleanDirectories,
					scssToCss,
					// bundleScriptAndStyleExtensions,
					// copyOtherAssets,
			  ]
			: [
					scssToCss,
					// bundleScriptAndStyleExtensions,
					// copyOtherAssets,
			  ],
	drop: mode === "production" ? ["console", "window"] : [],
	naming: {
		asset: "assets/[name]-[hash].[ext]",
	},
	// // Assets aren't copied during dev
	// publicPath:
	// 	mode === "development"
	// 		? `./../${Directory.BUNDLED_SCRIPTS_DIR.replace("./", "")}/`
	// 		: undefined,
};
const buildResult = await build(buildConfig);

if (mode == "development") {
	const tryBuild = async () => {
		try {
			await build({ ...buildConfig, plugins: [scssToCss] });
		} catch (error) {
			console.log("Build failed. Error:", error);
			console.log("Retrying in 5s");
			sleep(5000).finally(async () => {
				await tryBuild();
			});
		}
	};
	let subscription = watcher.subscribe(Directory.APP, async (_, events) => {
		events.forEach(async (e) => {
			if (
				e.path.endsWith(".ts") ||
				e.path.endsWith(".css") ||
				e.path.endsWith(".scss")
			) {
				await tryBuild();
			}
		});
	});

	process.on("SIGINT", async () => {
		await (await subscription).unsubscribe();
		process.exit(0);
	});
}

// const RELOAD_TXT = `${Directory.BUNDLED_STORY}/reload.txt`;
if (buildResult) {
	setupTweego().finally(async () => {
		// Start the live server
		// await $`refreshin -p 3000 -d ./dist --no-browser`;
		// // The sleep is just to avoid race issues with the html file
		// await sleep(100).finally(async () => {
		// 	// await $`bun ./dist/index.html`;
		// 	await $`bunx reload -p 3000 -d ./dist`;
		// 	// serve()
		// });
		if (mode == "development") {
			// let calledTimes = 1;
			let shouldCompile = true;
			const subscription = watcher.subscribe(Directory.OUTPUT, async () => {
				if (shouldCompile) {
					shouldCompile = false;
					await compileStory();
					// console.log("I am called " + calledTimes++ + " times");
					setTimeout(() => {
						shouldCompile = true;
					}, 1000);
				}
				// // A hacky way to prevent the live server from reloading multiple times over a short period of time
				// if (shouldReloadServer) {
				// 	shouldReloadServer = false;
				// 	setTimeout(() => {
				// 		shouldReloadServer = true;
				// 	}, 1000);
				// 	await $`touch ${RELOAD_TXT}`;
				// }
				// // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
				// await write(
				//   `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
				//   "Dummy"
				// );
			});

			// const subscription2 = watcher.subscribe(Directory.STORY, async () => {
			//   await compileStory();
			//   // // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
			//   // await write(
			//   //   `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
			//   //   "Dummy"
			//   // );
			// });

			process.on("SIGINT", async () => {
				await (await subscription).unsubscribe();
				// await (await subscription2).unsubscribe();
				process.exit(0);
			});
			// write(RELOAD_TXT, "Used as a hacky debounce workaround");
			// const target = Directory.BUNDLED_ASSETS;
			// const linkPath = Directory.BUNDLED_STORY_ASSETS;

			// // Only create the symlink if it doesn't already exist.
			// if (!existsSync(linkPath)) {
			// 	// On Windows, when linking directories, use the "junction" type for better compatibility.
			// 	symlinkSync(target, linkPath, "junction");
			// 	console.log(`Symlink created: ${linkPath} -> ${target}`);
			// } else {
			// 	console.log(`Symlink already exists at: ${linkPath}`);
			// }
			await $`[ ! -L "${Directory.BUNDLED_STORY_ASSETS}" ] && ln -s ../${Directory.BUNDLED_ASSETS}/ ${Directory.BUNDLED_STORY_ASSETS} || true`;
			await $`echo "Symlink ready."`;
			// await $`bunx reload -p 3000 -d ${Directory.BUNDLED_STORY} -e html`;
			// await $`bunx browser-sync start -s "dist" --files "dist" --no-open --reload-debounce 2000 --reload-delay 2000`;
			// await $`bunx browser-sync start -s "dist" --files "dist" --no-open --reload-debounce 1500`;
			// await $`bunx livereload dist/ -p 3000 -w 1000 -f 'index.html'`;
			// await $`cd ./dist && bunx live-server --port=3000 --wait=500 --ignore= --no-browser`;
			// await $`bunx alive-server --port=3000 --no-browser --open="${Directory.BUNDLED_STORY}" --watch="${Directory.BUNDLED_STORY}" --ignore="${Directory.BUNDLED_STORY_ASSETS}"`;
			// await $`bun run --bun rapidpreview --path ${Directory.BUNDLED_STORY} --port ${Directory.PORT}`;
			// await $`bunx refreshin --port 3000 --directory ${Directory.BUNDLED_STORY} -b false`;
			// await $`bunx yalive-server dev -c '{"root": "dist", "port": 3000, "cors": true, "https": true, "historyApiFallback": true }'`;…
			// await $`bunx five-server`
			await $`bun run --bun browser-sync start -s "${Directory.BUNDLED_STORY}" --files "${Directory.BUNDLED_STORY}/**/*.html" --port ${Directory.PORT} --no-open --reload-delay 1000 --reload-debounce 1000`;
		} else {
			await compileStory();
		}
	});
	// const tweego = new Tweenode({ writeToLog: true })

	async function compileStory() {
		//ANCHOR: The only reason I'm manually using a terminal command is because `tweenode` occasionally errors out with no reasonable logs >~<
		await $`cd .tweenode && ./tweego --head=../${
			Directory.HEAD_CONTENT
		} --module=../${Directory.VENDOR} ${
			mode == "development" ? "-t" : ""
		} --output=../${Directory.BUNDLED_STORY_NAME} ../${Directory.STORY} ../${
			Directory.BUNDLED_SCRIPTS_DIR
		}`; // ../${Directory.BUNDLED_STYLES_DIR}`;
		if (mode === "production") await copyAssets();
		// 		await $`if [ ! -L ${Directory.BUNDLED_STORY_ASSETS}" ]; then
		//   ln -s ${Directory.BUNDLED_ASSETS} ${Directory.BUNDLED_STORY_ASSETS}
		// fi`;

		// Copy over the assets

		// write(Directory.BUNDLED_STORY_NAME, blob())
		// await tweego.process({
		//   input: {
		//     storyDir: Directory.STORY,
		//     useTwineTestMode: mode == 'development' ? true : false,
		//     htmlHead: Directory.HEAD_CONTENT,
		//     modules: [Directory.VENDOR],
		//     scripts: Directory.BUNDLED_SCRIPTS_DIR,
		//     styles: Directory.BUNDLED_STYLES_DIR,
		//   },
		//   // output: { fileName: Directory.BUNDLED_STORY_NAME, mode: 'file' },
		//   output: { mode: 'file', fileName: Directory.BUNDLED_STORY_NAME },
		// })
	}

	// let shouldReloadServer = true;
	// if (mode == "development") {

	// }

	// await compileStory();
}

export {};
