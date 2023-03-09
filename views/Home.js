import LottieView from 'lottie-react-native';
import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import List from '../components/forms/List';
import PropTypes from 'prop-types';

import LottieIcons from '../components/forms/LottieIcons';
const Home = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <List navigation={navigation} />
        <LottieView source={require('../Lottie/Home.json')} autoPlay />
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

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
