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
                console: "readonly",
                process: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",

                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                jest: "readonly"
            }
        },

        plugins: {
            prettier: prettierPlugin
        },

        rules: {
            "prettier/prettier": "error",
            "no-console": "off",
            "no-unused-vars": "warn",
            "no-undef": "error",
            quotes: ["error", "double"],
            semi: ["error", "always"]
        }
    }
];
