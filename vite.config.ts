import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "ignore-ant-design",
          Once(root) {
            root.walkAtRules("import", (rule) => {
              if (rule.params.includes("antd/dist/reset.css")) {
                rule.remove();
              }
            });
          },
        },
      ],
    },
  },
});
