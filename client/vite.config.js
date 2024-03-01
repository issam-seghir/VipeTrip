import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteAliases } from "vite-aliases";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	base: "/mern-social-media/",
	// Getting rid of hashes in generated filenames
	filenameHashing: true,

	build: {
		// cssMinify: false, // disable CSS minify only
		// minify: false, // disable CSS/JS minify only
		// change output location
		rollupOptions: {
			output: {
				// manualChunks: undefined,
				// assetFileNames: "assets/[name].[ext]", // Output assets (e.g., images, SVGs) to the assets folder
				// entryFileNames: "assets/[name].js", // Output entry files (e.g., JavaScript) to the root directory
				// chunkFileNames: "assets/[name].[ext]", // Output dynamic imports (chunks) to the assets folder
				// Exclude all GIF files from being hashed
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith(".gif")) {
						return "[name].[ext]";
					}
					return `[name].[hash].[ext]`;
				},
			},
		},
	},

	server: {
		port: 3000,
		// open the server with google chrome browser
		// open: (process.env.BROWSER = "E:\\Apps\\scoop\\apps\\googlechrome-dev\\current\\chrome.exe"),
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
		// ! dont forget to import path
		// alias: [
		// 	// { find: "@scss", replacement: path.resolve(__dirname, "src/scss") },
		// 	// { find: "@", replacement: path.resolve(__dirname, "./src") },
		// 	// "~gerillass": path.resolve(__dirname, "node_modules/gerillass/scss/gerillass.scss"),
		// ],
	},
	plugins: [
		[react()],
		ViteAliases({
			dir: "src",
			prefix: "@",
			deep: true,
			depth: 2,
			adjustDuplicates: true,
			useConfig: true,
			/**
			 * Disables any terminal output
			 */
			silent: false,
		}),
		svgr({
			// svgr options: https://react-svgr.com/docs/options/
			svgrOptions: {
				plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
				svgoConfig: {
					plugins: ["preset-default", "removeTitle", "removeDesc", "removeDoctype", "cleanupIds"],
				},
			},
			// A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
			include: "**/*.svg?react",
		}),
	],
});
