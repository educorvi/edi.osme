module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
    },
    overrides: [
        {
            files: ["src/*"],
            "env": {
                browser: true,
                "commonjs": true,
                "es2021": true
            },
            parserOptions: {
                "ecmaVersion": 12,
                sourceType: "module"
            }
        }
    ]
};
