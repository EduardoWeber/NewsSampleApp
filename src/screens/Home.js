import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import NewsItem from '../components/NewsItem';
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
      <FlatList
        data={filteredList}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate('NewsArticle', {
                author: item.author,
                date: item.date,
                title: item.title,
              })
            }
          >
            <NewsItem
              author={item.author}
              date={item.date}
              title={item.title}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.spacer} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: 3,
    backgroundColor: '#2A9D8F',
  },
});
