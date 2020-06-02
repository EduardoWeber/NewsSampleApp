import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Observer } from 'mobx-react';
import NewsEditItem from '../components/NewsEditItem';
import Search from '../components/Search';
import DatabaseStore from '../stores/DatabaseStore';

export default function Home({ navigation }) {
  const [searchText, setSearchText] = useState('');

  function updateSearch(message) {
    setSearchText(message);
  }

  function getFilteredNews(title, newsArr) {
    return newsArr.filter((item) => {
      return item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
    });
  }

  React.useLayoutEffect(() => {
    setSearchText('');
    const unsubscribe = navigation.addListener('focus', () => {
      const parentNavigation = navigation.dangerouslyGetParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          title: 'Gerenciamento',
          headerRight: () => (
            <Search callbackFunc={updateSearch} key="management_search" />
          ),
        });
      }
    });
    return () => {
      navigation.removeListener(unsubscribe);
    };
  }, []);

  function formatDate(_date) {
    console.log(_date);
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

  return (
    <>
      <Observer>
        {() => (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Edit')}
            >
              <Text style={styles.addButtonText}>ADICIONAR NOTICIA</Text>
            </TouchableOpacity>
            {getFilteredNews(searchText, DatabaseStore.newsList).length ? (
              <SwipeListView
                data={getFilteredNews(searchText, DatabaseStore.newsList)}
                renderItem={(data) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('Edit', {
                        itemToEdit: data.item,
                      })
                    }
                  >
                    <NewsEditItem
                      author={data.item.author.name}
                      date={formatDate(data.item.date)}
                      title={data.item.title}
                      image={data.item.image}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.spacer} />}
                renderHiddenItem={(data) => (
                  <TouchableOpacity
                    style={styles.deleteButtonContainer}
                    onPress={() => DatabaseStore.removeNews(data.item.id)}
                  >
                    <View style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Deletar</Text>
                    </View>
                  </TouchableOpacity>
                )}
                disableRightSwipe
                rightOpenValue={-100}
                stopRightSwipe={-110}
              />
            ) : (
              <Text style={styles.noNewsText}>
                {DatabaseStore.newsList.length
                  ? 'Sem resultados para sua busca'
                  : 'Sem noticias cadastradas'}
              </Text>
            )}
          </View>
        )}
      </Observer>
    </>
  );
}

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: 1,
    backgroundColor: '#2A9D8F',
  },
  container: {
    flex: 1,
  },
  noNewsText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
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
