import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/Feather';
import NewsMeta from '../components/NewsMeta';

const screenWidth = Dimensions.get('window').width;

export default function NewsArticle({ route, navigation }) {
  const { title, author, date, text, imageSrc } = route.params;

  const image = require('../assets/1.jpg');

  return (
    <ScrollView>
      <View>
        <AutoHeightImage source={image} width={screenWidth} />
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={[styles.metaContainer]}>
        <NewsMeta author={author} date={date} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.textMargin}>{text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textMargin: {
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    marginHorizontal: 21,
  },
  backIcon: {
    top: 16,
    left: 16,
    position: 'absolute',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    marginHorizontal: 21,
  },
});
