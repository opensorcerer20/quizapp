import {
  Dimensions,
  ImageBackground,
} from "react-native";

import { THEMES } from "../common/constants";

require("../../assets/pexels-gantas-3750272.jpg");
require("../../assets/pexels-asphotograpy-518245.jpg");

const Background = ({ theme, children }) => {
  const { width, height } = Dimensions.get("window");
  const appBg =
    theme === THEMES.dark
      ? require("../../assets/pexels-gantas-3750272.jpg")
      : require("../../assets/pexels-asphotograpy-518245.jpg");
  return (
    <ImageBackground source={appBg} style={{ width: width, height: height }}>
      {children}
    </ImageBackground>
  );
};

export default Background;
