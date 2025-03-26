import { useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, StyleSheet, Dimensions } from 'react-native';
//import { Entypo } from '@expo/vector-icons'; // For 3-dot menu icon
//import Ionicons from '@expo/vector-icons/Ionicons';
import { FAB, Portal } from "react-native-paper";

const MAX_DECKS = 50;

export const DeckList = ({deckData, onPressDeck, onPressText, onEdit, onDelete}) => {
  const { width } = Dimensions.get("window");
  const SAFE_WIDTH = width - Math.round(width / 20); // 95% width
  const MODAL_WIDTH = 100; // arbitrary for now

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedItem, setSelectedItem] = useState(null);



  // @todo used when fab is clicked, need renaming
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;



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
    let modalX = Math.max(pageX - modalWidth, 0);
    modalX = Math.min(SAFE_WIDTH - MODAL_WIDTH, modalX);
    setMenuPosition({ top: pageY, left: modalX });
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const handleEdit = () => {
    //console.log(`Edit ${selectedItem?.title}`);
    unSelectItem();
  };

  const handleDelete = () => {
    onDelete(selectedItem.deckId);
    unSelectItem();
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable key={item.deckId} onPress={() => onPressDeck(item.deckId)} onLongPress={() => onPressDeck(item.deckId)}>
        <View style={[styles.item, selectedItem && item.deckId === selectedItem.deckId ? styles.selectedItem : {}]}>
          <Text>{item.name}</Text>
          <Pressable onLongPress={(event) => handleMenuPress(event, item)} onPress={(event) => handleMenuPress(event, item)}>
            <Text>...</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      { deckData.length > 0 && (
        <>
          <Text>Saved Decks</Text>
          <FlatList data={deckData} renderItem={renderItem} />

          {menuVisible && (
            <Modal transparent animationType="fade" visible={menuVisible}>
              <Pressable style={styles.overlay} onPress={() => handleModalClickAway()}>
                <View style={[styles.menu, { top: menuPosition.top, left: menuPosition.left }]}>
                  {/*<Pressable onPress={handleEdit}>
                    <Text style={styles.menuItem}>Edit</Text>
                  </Pressable>*/}
                  <Pressable onPress={handleDelete}>
                    <Text style={styles.menuItem}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          )}
        </>
      )}
      { deckData.length < 1 && (
        <Text>No decks in memory, please add a deck</Text>
      )}
      {deckData.length < MAX_DECKS && (
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={'plus'}
          actions={[
            {
              icon: 'text',
              label: 'Text',
              onPress: onPressText,
            },
            {
              icon: 'table',
              label: 'CSV',
              onPress: () => console.log('Pressed csv'),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
      )}
      {deckData.length >= MAX_DECKS && (<FAB
        icon="plus"
        style={[styles.fab, {backgroundColor: "lightgrey"}]}
      />)}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "orange",
  },
});

export default DeckList;
