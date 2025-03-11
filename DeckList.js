import { useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, StyleSheet } from 'react-native';
//import { Entypo } from '@expo/vector-icons'; // For 3-dot menu icon
//import Ionicons from '@expo/vector-icons/Ionicons';

export const DeckList = ({data, onPress}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedItem, setSelectedItem] = useState(null);

  const unSelectItem = () => {
    setSelectedItem(null);
    setMenuVisible(false);
  }

  const handleModalClickAway = () => {
    unSelectItem();
  }

  const handleMenuPress = (event, item) => {
    const { pageX, pageY } = event.nativeEvent;
    const modalWidth = 100;
    const modalX = Math.max(pageX - modalWidth, 0);
    setMenuPosition({ top: pageY, left: modalX });
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const handleEdit = () => {
    console.log(`Edit ${selectedItem?.title}`);
    unSelectItem();
  };

  const handleDelete = () => {
    console.log(`Delete ${selectedItem?.title}`);
    unSelectItem();
  };

  const renderItem = ({ item }) => {
    console.log('item ' + JSON.stringify(item));
    return (
      <Pressable onPress={() => onPress(item.id)} onLongPress={() => onPress(item.id)}>
    <View style={[styles.item, selectedItem && item.id === selectedItem.id ? styles.selectedItem : {}]}>
      <Text>{item.name}</Text>
      <Pressable onLongPress={(event) => handleMenuPress(event, item)} onPress={(event) => handleMenuPress(event, item)}>
        <Text>...</Text>
        {/*<Entypo name="dots-three-vertical" size={20} color="black" />*/}
      </Pressable>
    </View>
    </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      { data.length > 0 && (
        <>
          <Text>Saved Decks</Text>
          <FlatList data={data} keyExtractor={(item) => item.id} renderItem={renderItem} />

          {menuVisible && (
            <Modal transparent animationType="fade" visible={menuVisible}>
              <Pressable style={styles.overlay} onPress={() => handleModalClickAway()}>
                <View style={[styles.menu, { top: menuPosition.top, left: menuPosition.left }]}>
                  <Pressable onPress={handleEdit}>
                    <Text style={styles.menuItem}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={handleDelete}>
                    <Text style={styles.menuItem}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          )}
        </>
      )}
      { data.length < 1 && (
        <Text>No decks in memory, please add a deck</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#ffcccc',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: { paddingVertical: 5, paddingHorizontal: 10, fontSize: 16 },
});

export default DeckList;
