import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Input} from '@rneui/base';
import FilteredList from '../components/forms/FilteredList';
import {useState} from 'react';

const Search = ({navigation}) => {
  const [inputText, setInputText] = useState('');

  const onSearchinputChange = (value) => {
    setInputText(value);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Card>
          <Input
            placeholder="Search for posts..."
            onChangeText={onSearchinputChange}
          />
        </Card>

        <FilteredList filterString={inputText} navigation={navigation} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
