module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    root: true,
    extends: [
        'eslint:recommended',

        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',

        // 'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',

        // 'plugin:storybook/recommended',

        'plugin:import/recommended',
        'plugin:import/typescript',

        'plugin:tailwindcss/recommended',

        'prettier',
    ],

    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    plugins: [
        '@typescript-eslint',
        'import',
        'react',
        'react-refresh',
        'unused-imports',
    ],

    rules: {
        // default
        indent: 'off',
        quotes: 'off',
        semi: 'off',
        'linebreak-style': 'off',

        // React
        'react/prop-types': 'off',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],

        // tailwind
        'tailwindcss/no-custom-classname': [
            'warn',
            {
                callees: ['classnames', 'clsx', 'ctl', 'tv'],
            },
        ],

        // import
        'import/default': 'warn',
        'import/no-cycle': 'warn',
        'import/no-duplicates': 'warn',
        'import/no-named-as-default': 'off',
        'import/no-self-import': 'warn',
        'import/no-unassigned-import': 'off',
        'import/no-unresolved': 'error',
        'import/no-useless-path-segments': 'warn',

        // typescript
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                fixStyle: 'inline-type-imports',
            },
        ],

        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: {
                    arguments: false,
                    attributes: false,
                },
            },
        ],
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/sort-type-constituents': 'warn',

        /* unused imports */
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    },

    settings: {
        react: {
            version: 'detect',
        },

        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },

        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                // project: ['./tsconfig.json', './tsconfig.node.json'],
            },
        },
    },
};

/*
ni -D @typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
eslint \
eslint eslint-config-prettier \
eslint-import-resolver-typescript \
eslint-plugin-import@npm:eslint-plugin-i \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-unused-imports \
eslint-plugin-tailwindcss
*/
