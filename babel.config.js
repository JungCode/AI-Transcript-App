module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // alias
      [
        'module-resolver',
        {
          root: ['.'],
          alias: { '@': './' },
        },
      ],
    ],
  };
};
