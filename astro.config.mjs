import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://tai42.ai",
  output: "static",
  redirects: {
    "/about": "/company/about",
    "/contact": "/company/contact",
    "/babelfish/agentic-to-flow": "/babelfish",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
