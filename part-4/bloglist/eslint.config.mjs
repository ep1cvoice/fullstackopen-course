import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: { ...globals.node },
			ecmaVersion: 'latest',
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/arrow-spacing': ['error', { before: true, after: true }],
			eqeqeq: 'error',
			'no-console': 'off',
		},
	},
	{
		ignores: ['dist/**'],
	},
];
