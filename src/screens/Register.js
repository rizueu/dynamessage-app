import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Formik} from 'formik';
import * as Yup from 'yup';

import http from '../services';

import {useSelector, useDispatch} from 'react-redux';
import {setLoading, showPassword} from '../redux/actions/main';

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState([]);
  const peekPassword = useSelector(state => state.main.peekPassword);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('You must have an username!'),
    email: Yup.string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    password: Yup.string()
      .min(5, 'Password length must be at least 5 Characters')
      .required('Password is required'),
  });

  const submitHandler = async () => {
    const credentials = new URLSearchParams();
    credentials.append('username', values.username);
    credentials.append('email', values.email);
    credentials.append('password', values.password);
    dispatch(setLoading());
    try {
      const response = await http.register(credentials);
      dispatch(setLoading());
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
        hideOnPress: true,
      });
      navigation.navigate('Activate', response.data.results);
    } catch (error) {
      dispatch(setLoading());
      showMessage({
        message: error.response.data.message,
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text
          style={{
            ...text.heavy,
            fontSize: 16,
          }}>
          Let's Join DynaMessage!
        </Text>
        <KeyboardAwareScrollView>
          <View style={styles.inputGroup}>
            <Text>Username</Text>
            <TextInput
              style={styles.input}
              onChangeText={value =>
                setValues(current => {
                  return {
                    ...current,
                    username: value,
                  };
                })
              }
              value={values.username}
              placeholder="Write your username"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={value =>
                setValues(current => {
                  return {
                    ...current,
                    email: value,
                  };
                })
              }
              value={values.email}
              placeholder="Write your email"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={value =>
                setValues(current => {
                  return {
                    ...current,
                    password: value,
                  };
                })
              }
              value={values.password}
              placeholder="Write your password"
              secureTextEntry={!peekPassword}
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(showPassword());
            }}>
            <Icon name="eye" style={styles.eye} />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => submitHandler()}
            style={{
              ...styles.button,
              backgroundColor: '#348AF0',
              marginTop: 20,
            }}>
            <Text
              style={{
                ...text.center,
                ...text.white,
                ...text.heavy,
              }}>
              SIGN UP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                ...text.center,
                marginTop: 10,
                textDecorationLine: 'underline',
              }}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: 'white',
    height: '100%',
  },
  button: {
    width: '100%',
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
  },
  inputGroup: {
    marginTop: 15,
  },
  eye: {
    position: 'absolute',
    right: -15,
    top: 192,
    marginRight: 20,
    fontSize: 16,
  },
  input: {
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  line: {
    width: '100%',
    height: 0.9,
    backgroundColor: 'gray',
  },
});

const text = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  white: {
    color: 'white',
  },
  heavy: {
    fontWeight: 'bold',
  },
});

export default Register;
