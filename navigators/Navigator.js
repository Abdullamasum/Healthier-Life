import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import {MainContext} from '../contexts/MainContext';
import Upload from '../views/Upload';
import {Icon} from '@rneui/themed';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import Welcome from '../views/Welcome';
import UploadProfilePicture from '../views/UploadProfilePicture';
import {mainAppColor, tabActiveColor, tabInactiveColor} from '../utils/colors';
import {StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: styles.TabNavigator,
        tabBarActiveTintColor: tabActiveColor,
        tabBarInactiveTintColor: tabInactiveColor,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerStyle: styles.TabHeader,
          tabBarIcon: ({color}) => <Icon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          title: 'Upload',
          headerStyle: styles.TabHeader,
          tabBarIcon: ({color}) => <Icon name="cloud-upload" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'My Profile',
          headerStyle: styles.TabHeader,
          tabBarIcon: ({color}) => <Icon name="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              title: 'Post',
              headerStyle: styles.TabHeader,
            }}
          />
          <Stack.Screen
            name="MyFiles"
            component={MyFiles}
            options={{
              title: 'My Posts',
              headerStyle: styles.TabHeader,
            }}
          />
          <Stack.Screen
            name="Modify"
            component={Modify}
            options={{
              title: 'Edit Post',
              headerStyle: styles.TabHeader,
            }}
          />
          <Stack.Screen
            name="UpdateProfilePicture"
            component={UploadProfilePicture}
            options={{
              title: 'Update Profile Picture',
              headerStyle: styles.TabHeader,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              title: 'Welcome To Healthier Life',
              headerStyle: styles.TabHeader,
            }}
          ></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  TabNavigator: {backgroundColor: mainAppColor},
  TabHeader: {backgroundColor: mainAppColor},
});

export default Navigator;
