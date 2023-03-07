import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Button, Card, Icon, ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import missingProfileImage from '../img/missingProfile.png';
import ProfileEditForm from '../components/forms/ProfileEditForm';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {update, setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [toggleEditForm, setToggleEditForm] = useState(false);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('User avatar fetch failed: ', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, [update]);

  const onChangeProfilePicturePressed = () => {
    navigation.navigate('UpdateProfilePicture');
  };

  const onToggleEditPressed = () => {
    setToggleEditForm(!toggleEditForm);
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title>{user.username}</Card.Title>
        <Card.Image
          source={avatar ? {uri: uploadsUrl + avatar} : missingProfileImage}
        />

        <ListItem>
          <Icon name="email" />
          <ListItem.Title>{user.email}</ListItem.Title>
          <Icon name="badge" />
          <ListItem.Title>{user.full_name}</ListItem.Title>
        </ListItem>

        <Button
          title="Logout!"
          onPress={async () => {
            console.log('Logging out!');
            setUser({});
            setIsLoggedIn(false);
            try {
              await AsyncStorage.clear();
            } catch (error) {
              console.error('clearing asyncstorage failed', error);
            }
          }}
        />

        <CardDivider />

        <Button
          title="My Files"
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
      </Card>

      <Card>
        <Button
          title="Change Profile Photo"
          onPress={onChangeProfilePicturePressed}
        />

        <CardDivider />

        {!toggleEditForm || (
          <ProfileEditForm setToggleEditForm={setToggleEditForm} />
        )}
        <Button
          title={toggleEditForm ? 'Hide Edit User Info' : 'Edit User Info'}
          onPress={onToggleEditPressed}
        />
      </Card>
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
