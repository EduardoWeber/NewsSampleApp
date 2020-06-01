import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import NewsEditItem from '../components/NewsEditItem';
import Search from '../components/Search';

const DATA = [
  {
    author: 'Fulano',
    date: 'Hoje',
    title: 'Titulo da noticia',
  },
  {
    author: 'Fulano',
    date: 'Hoje',
    title: 'Titulo muito bom',
  },
  {
    author: 'Fulano',
    date: 'Hoje',
    title: 'Titulo muito super longo de teste longo pra ver quanto que vai dar',
  },
  {
    author: 'Fulano',
    date: 'Hoje',
    title: 'Titulo noticia',
  },
];

export default function Home({ navigation }) {
  const [filteredList, setFilteredList] = useState(DATA);

  function filterList(title) {
    const newList = DATA.filter((item) => {
      return item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
    });
    setFilteredList(newList);
  }

  function updateSearch(message) {
    filterList(message);
  }

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const parentNavigation = navigation.dangerouslyGetParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          headerRight: () => <Search callbackFunc={updateSearch} />,
        });
      }
    });
    return () => {
      navigation.removeListener(unsubscribe);
    };
  }, []);

  return (
    <>
      <SwipeListView
        data={filteredList}
        ListHeaderComponent={() => (
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>ADICIONAR NOTICIA</Text>
          </TouchableOpacity>
        )}
        renderItem={(data, rowMap) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Edit', data.item)}
          >
            <NewsEditItem
              author={data.item.author}
              date={data.item.date}
              title={data.item.title}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.spacer} />}
        renderHiddenItem={(data, rowMap) => (
          <TouchableOpacity style={styles.deleteButtonContainer}>
            <View style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </View>
          </TouchableOpacity>
        )}
        disableRightSwipe
        rightOpenValue={-100}
        stopRightSwipe={-110}
      />
      {/* <FlatList
        data={filteredList}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.6}>
            <NewsEditItem
              author={item.author}
              date={item.date}
              title={item.title}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.spacer} />}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: 1,
    backgroundColor: '#2A9D8F',
  },
  deleteButtonContainer: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  deleteButton: {
    width: 100,
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    color: 'white',
  },
  addButton: {
    height: 35,
    width: '100%',
    backgroundColor: '#D4D4D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
  },
});
