/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  moduleDirectories: ["node_modules", "./util/tests", __dirname],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|expo-asset/.*|expo-font/.*)",
  ],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
