module.exports = function (api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo"], "nativewind/babel"],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "tailwind.config": "./tailwind.config.js",
            "@components": "./src/components",
            "@api": "./src/api",
            "@domain": "./src/domain",
            "@infra": "./src/infra",
            "@services": "./src/services",
            "@store": "./src/store",
            "@theme": "./src/theme",
            "@types": "./src/types",
            "@utils": "./src/utils",
          },
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};
