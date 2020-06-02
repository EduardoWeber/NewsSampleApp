import React from 'react';
import { Text, StyleSheet, Image, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewsMeta from './NewsMeta';

// const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function NewsItem({ title, author, date, image }) {
  console.log(image);
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.metaContainer}>
        <NewsMeta style={styles.shadow} author={author} date={date} />
      </View>
      <View style={styles.titleContainer}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={styles.gradient}
        />
        <Text style={[styles.title, styles.textMargin]}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight / 3,
  },
  titleContainer: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textMargin: {
    marginHorizontal: 16,
  },
  metaContainer: {
    position: 'absolute',
    top: 8,
    right: 16,
  },
  author: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    color: 'white',
    backgroundColor: '#E76F51',
    fontSize: 12,
  },
  date: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    color: 'white',
    backgroundColor: '#E9C46A',
    fontSize: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
