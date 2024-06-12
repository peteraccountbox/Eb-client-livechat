module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'jsx-a11y'], // Add 'jsx-a11y' to the plugins array
    rules: {
      // Additional rules can be added here
      'jsx-a11y/anchor-is-valid': 'off', // Example rule from jsx-a11y
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  