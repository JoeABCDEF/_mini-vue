import ts from "@rollup/plugin-typescript";
import { defineConfig } from 'rollup';
import pkg from './package.json';

export default defineConfig({
    input: "./src/index.ts",
    // 可以打包出多种模块规范
    output: [
        {
            format: "cjs",
            file: pkg.main,
        },
        {
            format: "es",
            file: pkg.module,
        },
    ],

    plugins: [
        ts({
            sourceMap: true
        })
    ],
});