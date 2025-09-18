module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // giữ plugin của expo-router nếu có
      'expo-router/babel',
      // thêm alias
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
