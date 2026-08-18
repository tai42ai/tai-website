import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://tai42.ai",
  output: "static",
  redirects: {
    "/product/babelfish": "/platform/",
    "/product/nexus": "/platform/",
    "/how-it-works": "/method/",
    "/pricing": "/platform/",
    "/babelfish": "/platform/",
    "/babelfish/agentic-to-flow": "/platform/",
    "/company/about": "/about/",
    "/company/contact": "/contact/",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
