import React, {useContext, useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/forms/LoginForm';
import {Card} from '@rneui/themed';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  // TODO: Move this to the home screen instead of logging in!
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) return; // Return if no existing token

      console.log('Login, checkToken, token:', userToken);
      const userData = await getUserByToken(userToken);
      console.log(userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.warn('No valid token available', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card>
          <LoginForm />
        </Card>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
