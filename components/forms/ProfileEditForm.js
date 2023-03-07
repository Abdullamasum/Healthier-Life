import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../../contexts/MainContext';
import {useUser} from '../../hooks/ApiHooks';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import PropTypes from 'prop-types';
import {mainAppColor} from '../../utils/colors';

const ProfileEditForm = (props) => {
  const {changeUser} = useUser();
  const {user} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      token: null,
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const setToggleEditForm = props.setToggleEditForm;

  const saveChanges = async (userData) => {
    console.log('Updating user data: ', userData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) {
        console.error(
          'ProfileEditForm, saveChanges: Trying to change user data without a token'
        );
        return;
      }

      userData.token = userToken;

      const saveResult = await changeUser(userData);
      console.log('ProfileEditForm, saveChanges', saveResult);

      // Let the user know the data has been saved!
      Alert.alert(
        'User Info Updated!',
        'You might need to log in again to see the changes.',
        [
          {
            text: 'Ok',
            onPress: () => {
              setToggleEditForm(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('ProfileEditForm, saveChanges: ', error);
      // TODO: notify user about failed update
      return;
    }
  };

  return (
    <View>
      <Text>Edit User Info</Text>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 2, message: 'Must be at least 2 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Full Name"
            autoCapitalize="words"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          pattern: {
            value: /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: 'Invalid Email form',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      />

      <Button
        title="Save Changes"
        color={mainAppColor}
        onPress={handleSubmit(saveChanges)}
      />

      <CardDivider />
    </View>
  );
};

ProfileEditForm.propTypes = {
  setToggleEditForm: PropTypes.func,
};

export default ProfileEditForm;
