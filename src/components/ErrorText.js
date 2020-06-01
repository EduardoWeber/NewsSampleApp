import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function ErrorText({ textError }) {
  return (
    <View style={styles.errorContainer}>
      {textError ? <Text style={styles.errorText}>{textError}</Text> : <></>}
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 1,
    marginLeft: 5,
    height: 15,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
});
