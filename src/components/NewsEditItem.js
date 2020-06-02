import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';
import ImageEditor from '@react-native-community/image-editor';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function NewsItem({ title, author, date, image }) {
  // eslint-disable-next-line global-require
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      console.log(width, height);
      let offsetX = 0;
      let offsetY = 0;
      let cropHeight = height;
      let cropWidth = width;
      if (width > height) {
        cropWidth = height;
        offsetX = (width - cropWidth) / 2;
      } else if (height > width) {
        cropHeight = width;
        offsetY = (height - cropHeight) / 2;
      }
      ImageEditor.cropImage(image, {
        offset: { x: offsetX, y: offsetY },
        size: { width: cropWidth, height: cropHeight },
        displaySize: { width: 80, height: 80 },
      }).then((croppedUrl) => {
        setImageUrl(croppedUrl);
        console.log('Cropped image:', croppedUrl);
      });
    });
  }, [image]);

  function getCroppedImage() {
    if (imageUrl.length) {
      return <Image source={{ uri: imageUrl }} style={styles.image} />;
    }
    return <View style={styles.image} />;
  }

  return (
    <View style={styles.container}>
      {getCroppedImage()}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.textMetaContainer}>
          <View style={styles.metaTextItem}>
            <MaterialIcons name="person-outline" size={24} color="#757575" />
            <Text style={styles.metaText}>{author}</Text>
          </View>
          <View style={styles.metaTextItem}>
            <MaterialIcons name="access-time" size={24} color="#757575" />
            <Text style={styles.metaText}>{date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaTextItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
  },
});
