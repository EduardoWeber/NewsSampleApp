import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Search({ callbackFunc }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }

  function clearText() {
    setText('');
    callbackFunc('');
  }

  return (
    <>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => toggleModal()}
      >
        <Icon name="search" size={24} color="#FFF" />
      </TouchableOpacity>
      <Modal
        backdropTransitionOutTiming={0}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => {
          setModalVisible(false);
          clearText();
        }}
        animationIn="fadeInRight"
        animationOut="fadeOutRight"
        backdropOpacity={0.4}
      >
        <View style={styles.modalContainer}>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.textField}
              placeholder="Pesquisa"
              autoFocus
              onChangeText={(_text) => {
                setText(_text);
                callbackFunc(_text);
              }}
              onEndEditing={() => {
                callbackFunc(text);
                setModalVisible(false);
              }}
              value={text}
            />
            <TouchableOpacity
              onPress={() => {
                clearText();
              }}
            >
              <IconMCI name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    marginRight: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  fieldContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textField: {
    margin: 5,
    flex: 1,
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#949494',
  },
});
