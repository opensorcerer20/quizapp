import { Text } from "react-native";

const TextNormal = (props) => {
  let otherProps = {};
  Object.keys(props).map((propName) => {
    if (propName !== "children") {
      otherProps[propName] = props[propName];
    }
  });
  // return <Text allowFontScaling={false}>{children}</Text>;
  return (
    <Text allowFontScaling={false} {...otherProps}>
      {props.children}
    </Text>
  );
};

export default TextNormal;
