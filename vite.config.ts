import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			assets: path.resolve(__dirname, "src/assets"),
		},
	},
	plugins: [react()],
});
