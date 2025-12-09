const js = require("@eslint/js");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                module: "readonly",
                require: "readonly",
                process: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                jest: "readonly"
            }
        },
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            "prettier/prettier": "error",
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "error",
            semi: ["error", "always"],
            quotes: ["error", "double"],
        }
    }
];
