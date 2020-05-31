import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function NewsMeta({ author, date }) {
  return (
    <View style={styles.container}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
});
