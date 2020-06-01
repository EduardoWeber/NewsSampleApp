import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Picker,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import ImageEditor from '@react-native-community/image-editor';
import AutoHeightImage from 'react-native-auto-height-image';
import RNFS from 'react-native-fs';

export function ErrorText({ textError }) {
  return (
    <View style={styles.errorContainer}>
      {textError ? <Text style={styles.errorText}>{textError}</Text> : <></>}
    </View>
  );
}

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

export default function Home({ navigation }) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  // Forms image
  const [image, setImage] = useState('');
  const [imageCropped, setImageCropped] = useState('');
  // Forms
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());
  // Forms errors
  const [errorTitle, setErrorTitle] = useState('');
  const [errorAuthor, setErrorAuthor] = useState('');
  const [errorCover, setErrorCover] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const allAuthors = ['item1', 'item2', 'item3'];

  function filterData(_query) {
    const newData = allAuthors.filter((item) => {
      return item.toLocaleLowerCase().includes(_query.toLocaleLowerCase());
    });
    setData(newData);
  }

  useEffect(() => {
    filterData(author);
  }, [author]);

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

  function getImage() {
    if (image.length) {
      return (
        <AutoHeightImage
          source={{ uri: `data:image/gif;base64,${image}` }}
          width={140}
        />
      );
    }
    return <View style={styles.imagePreview} />;
  }

  function callbackImagePicker(response) {
    if (response && !response.didCancel && !response.error) {
      setImage(response.data);
      // Crop image for preview
      const { height, width } = response;
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
      ImageEditor.cropImage(response.uri, {
        offset: { x: offsetX, y: offsetY },
        size: { width: cropWidth, height: cropHeight },
        displaySize: { width: 80, height: 80 },
      }).then((croppedUrl) => {
        RNFS.readFile(croppedUrl, 'base64').then((res) => {
          setImageCropped(res);
        });
      });
    }
  }

  function ImageCover({ textError }) {
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

  function AutocompleteField({ textError }) {
    function getAuthors() {
      const arr = allAuthors.map((item) => {
        return <Picker.Item label={item} value={item} />;
      });
      return arr;
    }
    return (
      <>
        <Picker
          selectedValue={author}
          onValueChange={(itemValue, itemIndex) => setAuthor(itemValue)}
        >
          <Picker.Item label="Selecione o autor" value="" />
          {getAuthors()}
        </Picker>
        <ErrorText textError={textError} />
      </>
    );
  }

  function authorExist(_author) {
    for (let i = 0; i < allAuthors.length; i += 1) {
      const authorItem = allAuthors[i];
      if (authorItem.toLocaleLowerCase() === _author.toLocaleLowerCase()) {
        return true;
      }
    }
    return false;
  }

  function checkFields() {
    let errorCount = 0;
    if (!title.length) {
      setErrorTitle('Titulo é um campo obrigatório');
      errorCount += 1;
    } else {
      setErrorTitle('');
    }

    if (!author.length) {
      setErrorAuthor('Autor é um campo obrigatório');
      errorCount += 1;
    } else if (!authorExist(author)) {
      setErrorAuthor('Autor não encontrado');
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

    if (errorCount) {
      setErrorForm('Houve algum erro no formulário');
      return true;
    }
    setErrorForm('');
    return false;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.safeAreaContainer}
    >
      <TextField
        placeholder="Titulo"
        autoFocus
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

      <ImageCover textError={errorCover} />

      <TextInput
        style={styles.textArea}
        placeholder="Descrição"
        multiline
        onChangeText={setDesc}
      />
      <ErrorText textError={errorForm} />
      <Button title="Postar" onPress={() => checkFields()} />
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
    marginBottom: 16,
    minHeight: 200,
  },
  error: {
    borderBottomColor: 'red',
  },
  errorContainer: {
    marginTop: 1,
    marginLeft: 5,
    height: 15,
  },
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
  errorText: {
    fontSize: 10,
    color: 'red',
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
