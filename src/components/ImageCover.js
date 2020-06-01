import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import ErrorText from './ErrorText';

export default function ImageCover({ image, callbackImagePicker, textError }) {
  function getImage() {
    if (image.length) {
      return (
        <AutoHeightImage
          key="image_dont_do_this"
          source={{ uri: `data:image/gif;base64,${image}` }}
          width={140}
        />
      );
    }
    return <View style={styles.imagePreview} />;
  }

  return (
    <>
      <View style={styles.coverInput}>
        {getImage()}
        <View style={styles.buttonContainer}>
          <Button
            title="SELECIONAR CAPA"
            onPress={() =>
              ImagePicker.launchImageLibrary(
                {
                  tintColor: 'grey',
                  mediaType: 'photo',
                },
                callbackImagePicker
              )
            }
          />
        </View>
      </View>
      <ErrorText textError={textError} />
    </>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    backgroundColor: '#757575',
    width: 140,
    height: 80,
  },
  coverInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
