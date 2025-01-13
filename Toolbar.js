import {StyleSheet, View} from "react-native";
import {MyButton2, schemes} from "./lib";
import Ionicons from '@expo/vector-icons/Ionicons';

const Toolbar = ({showBack, backCallback, colorScheme = "light", }) => {
    const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    return (
        <View style={[styles.toolbar, {flexDirection: "row"}, scheme.bg]}>
            <View style={{flex: 1}}>
              {showBack && (
                <MyButton2 onPress={() => backCallback()}>
                  <Ionicons name="arrow-back-circle-outline" size={32} color={scheme.txt.color}></Ionicons>
                </MyButton2>
              )}
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
              <MyButton2 onPress={() => console.log('gear press')}>
                <Ionicons name="settings-outline" size={32} color={scheme.txt.color}></Ionicons>
              </MyButton2>
            </View>
      </View>
    );
};

const styles = StyleSheet.create({
    toolbar: {
      flex: 1,
    },
    ...schemes
});

export default Toolbar;
