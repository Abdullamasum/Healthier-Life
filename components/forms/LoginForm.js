import React, {useState} from 'react';
import {useContext} from 'react';
import {Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../../contexts/MainContext';
import {useAuthentication} from '../../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Text} from '@rneui/base';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {mainAppColor} from '../../utils/colors';

const LoginForm = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: {username: '', password: ''}});
  const [displayPassword, changeDisplayPassword] = useState(false);

  const logIn = async (loginData) => {
    console.log('Logging in!');
    console.log(loginData);
    try {
      const loginResult = await postLogin(loginData);
      console.log('LogIn, logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('LogIn, logIn: ', error);
      // TODO: notify user about failed login
      Alert.alert(
        'Login failed',
        'Something went wrong. Please make sure your login info is correct',
        [{text: 'Ok'}]
      );
    }
  };

  return (
    <View>
      <Text>Login Form</Text>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />

      <Button
        title={displayPassword ? 'Hide Password' : 'Show Password'}
        color={mainAppColor}
        onPress={() => {
          changeDisplayPassword(!displayPassword);
        }}
      />
      <CardDivider />
      <Button
        title="Sign in"
        color={mainAppColor}
        onPress={handleSubmit(logIn)}
      />
    </View>
  );
};

export default LoginForm;
