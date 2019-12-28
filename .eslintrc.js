module.exports = {
    env: {
        es6: true,
        browser: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    plugins: [
        "@typescript-eslint"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    },
    rules: {
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: 'explicit',
            overrides: {
                accessors: 'explicit',
                constructors: 'no-public',
                methods: 'explicit',
                properties: 'explicit',
                parameterProperties: 'explicit'
            }
        }],
        "no-multi-spaces": [
            "error",
            { ignoreEOLComments: false }
        ],
        "operator-linebreak": [
            "error",
            "after",
            {
                "overrides": {
                    "?": "before",
                    ":": "before"
                }
            }
        ]
    }
};