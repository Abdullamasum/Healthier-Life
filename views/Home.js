import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import List from '../components/forms/List';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <view>
      <SafeAreaView style={styles.container}>
        <List navigation={navigation} />
      </SafeAreaView>
    </view>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
