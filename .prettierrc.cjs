module.exports = {
    semi: true,
    printWidth: 80,
    tabWidth: 4,
    singleQuote: true,
    bracketSpacing: true,
    bracketSameLine: false,
    useTabs: false,
    arrowParens: 'always',
    jsxSingleQuote: true,
    trailingComma: 'all',

    importOrderParserPlugins: ['classProperties', 'typescript', 'jsx'],
    importOrder: [
        '^~assets/(.*)$',
        '^~/assets/(.*)$',
        '^~components/(.*)$',
        '^~/components/(.*)$',
        '^~features/(.*)$',
        '^~/features/(.*)$',
        '^~utils/(.*)$',
        '^~/utils/(.*)$',
        '^[../]',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: true,
    plugins: [
        require.resolve('@trivago/prettier-plugin-sort-imports'),
        require.resolve('prettier-plugin-tailwindcss'),
    ],
};

/*
  ni -D prettier \
  @trivago/prettier-plugin-sort-imports \
  prettier-plugin-tailwindcss
*/
