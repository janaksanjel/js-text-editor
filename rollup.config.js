import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss"; // Add this for CSS

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    postcss({
      extract: "styles.css", // Extract CSS to a separate file
      minimize: true, // Minify the CSS
    }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
      exclude: "node_modules/**",
    }),
    commonjs(), // Move this after babel
    terser(),
  ],
  external: ["react", "react-dom", "react-bootstrap", "bootstrap", "react-icons"],
};