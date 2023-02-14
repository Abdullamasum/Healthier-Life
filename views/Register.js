import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import RegisterForm from '../components/forms/RegisterForm';
import {Card} from '@rneui/themed';

const Register = ({navigation}) => {
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
          <Text>Register</Text>
          <RegisterForm />
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

Register.propTypes = {
  navigation: PropTypes.object,
};

export default Register;
