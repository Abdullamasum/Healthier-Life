import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Card, Text} from '@rneui/base';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';
const Welcome = () => {
  const [toggleForm, setToggleForm] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
          <Card style={styles.Card}>
            <ScrollView>
              <Text style={styles.text}>
                Healthy lifestyle and longevity Researchers from the Harvard
                T.H. Chan School of Public Health conducted a massive study of
                the impact of health habits on life expectancy, using data from
                the well-known Nurses’ Health Study (NHS) and the Health
                Professionals Follow-up Study (HPFS). This means that they had
                data on a huge number of people over a very long period of time.
                The NHS included over 78,000 women and followed them from 1980
                to 2014. The HPFS included over 40,000 men and followed them
                from 1986 to 2014. This is over 120,000 participants, 34 years
                of data for women, and 28 years of data for men. The researchers
                looked at NHS and HPFS data on diet, physical activity, body
                weight, smoking, and alcohol consumption that had been collected
                from regularly administered, validated.
              </Text>
            </ScrollView>
          </Card>
          <Card>
            <ScrollView>
              <Text> Here goes the image or video</Text>
            </ScrollView>
          </Card>
          <Card>
            <ScrollView>
              {toggleForm ? <LoginForm /> : <RegisterForm />}
              <Text>
                {toggleForm
                  ? 'No account yet? Please register.'
                  : 'Already have an account? Please login.'}
              </Text>
              <Button
                type="outline"
                title={toggleForm ? `Go to Register` : 'Go to login'}
                onPress={() => {
                  setToggleForm(!toggleForm);
                }}
              />
            </ScrollView>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '200',
  },
  Card: {
    height: 200,
  },
});

export default Welcome;
