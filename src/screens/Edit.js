import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Picker,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Observer } from 'mobx-react';
import ImageCover from '../components/ImageCover';
import ErrorText from '../components/ErrorText';
import DatabaseStore from '../stores/DatabaseStore';

export function TextField({
  placeholder,
  autoFocus,
  textError,
  editable,
  value,
  onChangeText,
}) {
  return (
    <>
      <TextInput
        style={textError ? [styles.textField, styles.error] : styles.textField}
        placeholder={placeholder}
        autoFocus={autoFocus}
        editable={editable}
        value={value}
        onChangeText={onChangeText}
      />
      <ErrorText textError={textError} />
    </>
  );
}

export default function Home({ navigation, route }) {
  const [datePicker, setDatePicker] = useState(false);
  const [id, setId] = useState(null);
  // Forms image
  const [image, setImage] = useState('');
  // Forms
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());
  // Forms errors
  const [errorTitle, setErrorTitle] = useState('');
  const [errorAuthor, setErrorAuthor] = useState('');
  const [errorCover, setErrorCover] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    if (route.params && route.params.itemToEdit) {
      const { itemToEdit } = route.params;
      setTitle(itemToEdit.title);
      setImage(itemToEdit.image);
      setAuthor(itemToEdit.author);
      setDate(new Date(itemToEdit.date));
      setDesc(itemToEdit.desc);
      setId(itemToEdit.id);
      navigation.setOptions({
        title: 'Editando noticia',
      });
    } else {
      setId(null);
      navigation.setOptions({
        title: 'Criando noticia',
      });
    }
  }, [route]);

  function formatDate(_date) {
    if (_date) {
      // return ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
      // date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
      try {
        return `${`0${_date.getDate()}`.slice(-2)}/${`0${
          _date.getMonth() + 1
        }`.slice(-2)}/${_date.getFullYear()}`;
      } catch {
        return '';
      }
    }
    return '';
  }

  function callbackImagePicker(response) {
    if (response && !response.didCancel && !response.error) {
      setImage(response.uri);
    }
  }

  function AutocompleteField({ textError }) {
    function getAuthors() {
      const arr = DatabaseStore.authorsList.map((item) => {
        return <Picker.Item label={item.name} value={item} key={item.id} />;
      });
      return arr;
    }
    return (
      <>
        <Observer>
          {() => (
            <Picker
              selectedValue={author}
              onValueChange={(itemValue) => setAuthor(itemValue)}
            >
              <Picker.Item label="Selecione o autor" value={null} />
              {getAuthors()}
            </Picker>
          )}
        </Observer>
        <ErrorText textError={textError} />
      </>
    );
  }

  function checkFields() {
    let errorCount = 0;
    if (!title.length) {
      setErrorTitle('Titulo é um campo obrigatório');
      errorCount += 1;
    } else {
      setErrorTitle('');
    }

    if (!author) {
      setErrorAuthor('Autor é um campo obrigatório');
      errorCount += 1;
    } else {
      setErrorAuthor('');
    }

    if (!image.length) {
      setErrorCover('Imagem de capa não foi selecionada');
      errorCount += 1;
    } else {
      setErrorCover('');
    }

    if (!desc.length) {
      setErrorDesc('Descrição da noticia é um campo obrigatório');
      errorCount += 1;
    } else {
      setErrorDesc('');
    }

    if (errorCount) {
      setErrorForm('Houve algum erro no formulário');
      return false;
    }
    setErrorForm('');
    return true;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.safeAreaContainer}
    >
      <TextField
        placeholder="Titulo"
        autoFocus
        value={title}
        onChangeText={setTitle}
        textError={errorTitle}
      />

      <AutocompleteField textError={errorAuthor} />

      <TouchableOpacity onPress={() => setDatePicker(true)}>
        <View pointerEvents="none">
          <TextField value={formatDate(date)} placeholder="Data" />
        </View>
      </TouchableOpacity>

      {datePicker && (
        <DateTimePicker
          value={new Date()}
          onChange={(event, _date) => {
            setDatePicker(false);
            setDate(_date);
          }}
        />
      )}

      <ImageCover
        callbackImagePicker={callbackImagePicker}
        image={image}
        textError={errorCover}
      />

      <TextInput
        value={desc}
        style={styles.textArea}
        placeholder="Descrição"
        multiline
        onChangeText={setDesc}
      />
      <ErrorText textError={errorDesc} />
      <Button
        color="#264653"
        title={id !== null ? 'Alterar' : 'Postar'}
        onPress={() => {
          if (checkFields()) {
            if (id) {
              DatabaseStore.editNews(id, title, author, desc, date, image);
              navigation.pop();
            } else {
              DatabaseStore.insertNews(title, author, desc, date, image);
              navigation.pop();
            }
          }
        }}
      />
      <ErrorText textError={errorForm} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    margin: 16,
    flex: 1,
  },
  textField: {
    paddingVertical: 2,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  textArea: {
    flex: 1,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#949494',
    justifyContent: 'flex-start',
    borderRadius: 5,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    minHeight: 200,
  },
  error: {
    borderBottomColor: 'red',
  },
  listContainer: {
    position: 'absolute',
    top: 24,
    zIndex: 1,
    width: '100%',
  },
  image: {
    width: 140,
    height: 80,
    resizeMode: 'cover',
  },
});
