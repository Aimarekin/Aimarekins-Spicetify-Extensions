// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import globals from "globals"

export default tseslint.config(
	{
		languageOptions: { globals: { ...globals.browser } }
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		ignores: ["dist/"],
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_"
				}
			],
			"prettier/prettier": [
				"warn",
				{
					printWidth: 120,
					tabWidth: 4,
					useTabs: true,
					semi: false,
					trailingComma: "none",
					bracketSpacing: true,
					bracketSameLine: true,
					arrowParens: "always"
				}
			]
		}
	}
)
