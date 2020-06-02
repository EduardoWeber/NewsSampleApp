import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import ErrorText from './ErrorText';

export default function ImageCover({ image, callbackImagePicker, textError }) {
  function getImage() {
    if (image.length) {
      return <AutoHeightImage source={{ uri: image }} width={140} />;
    }
    return <View style={styles.imagePreview} />;
  }

  return (
    <>
      <View style={styles.coverInput}>
        {getImage()}
        <View style={styles.buttonContainer}>
          <Button
            color="#264653"
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
