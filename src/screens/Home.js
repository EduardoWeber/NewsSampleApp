import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Observer } from 'mobx-react';
import NewsItem from '../components/NewsItem';
import Search from '../components/Search';
import DatabaseStore from '../stores/DatabaseStore';

export default function Home({ navigation }) {
  const [searchText, setSearchText] = useState('');

  function updateSearch(message) {
    setSearchText(message);
  }

  function formatDate(_date) {
    if (_date) {
      try {
        return `${`0${_date.getDate()}`.slice(-2)}/${`0${
          _date.getMonth() + 1
        }`.slice(-2)}`;
      } catch {
        return '';
      }
    }
    return '';
  }

  function getFilteredNews(title, newsArr) {
    return newsArr.filter((item) => {
      return item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
    });
  }

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      const parentNavigation = navigation.dangerouslyGetParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          title: 'Home',
          headerRight: () => (
            <Search callbackFunc={updateSearch} key="home_search" />
          ),
        });
      }
    });
    return () => {
      navigation.removeListener(unsubscribe);
    };
  }, []);

  return (
    <>
      <Observer>
        {() => (
          <View style={styles.container}>
            {getFilteredNews(searchText, DatabaseStore.newsList).length ? (
              <FlatList
                data={getFilteredNews(searchText, DatabaseStore.newsList)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate('NewsArticle', {
                        author: item.author.name,
                        date: formatDate(item.date),
                        title: item.title,
                        image: item.image,
                        desc: item.desc,
                      })
                    }
                  >
                    <NewsItem
                      author={item.author.name}
                      date={formatDate(item.date)}
                      title={item.title}
                      image={item.image}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.spacer} />}
              />
            ) : (
              <Text style={styles.noNewsText}>
                {DatabaseStore.newsList.length
                  ? 'Sem resultados para sua busca'
                  : 'Sem novidades por aqui agora...'}
              </Text>
            )}
          </View>
        )}
      </Observer>
    </>
  );
}

// <Text style={styles.noNewsText}>
//   Sem novidades por aqui agora...
// </Text>

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: 3,
    backgroundColor: '#2A9D8F',
  },
  container: {
    backgroundColor: '#2A9D8F',
    flex: 1,
  },
  noNewsText: {
    fontSize: 16,
    flex: 1,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
