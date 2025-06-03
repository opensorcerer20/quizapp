import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadStorageData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.log(
            `error loading data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(e))
        );
    }
};

export const saveStorageData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.log(
            `error saving data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(error))
        );
    }
};

export const removeStorageData = async (key) => {
    try {
        const value = await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.log(
            `error loading data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(e))
        );
    }
};
