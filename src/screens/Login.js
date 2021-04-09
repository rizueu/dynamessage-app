import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Yup from 'yup';
import http from '../services';

import {useSelector, useDispatch} from 'react-redux';
import {login, setNullError} from '../redux/actions/auth';
import {setLoading, showPassword} from '../redux/actions/main';

const Login = () => {
  const [values, setValues] = useState({
    id: '',
    password: '',
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const errorMsg = useSelector(state => state.auth.errorMsg);
  const peekPassword = useSelector(state => state.main.peekPassword);

  const validationSchema = Yup.object().shape({
    id: Yup.string().required('Email Address or Username is Required'),
    password: Yup.string()
      .min(5, 'Password length must be at least 5 Characters')
      .required('Password is required'),
  });

  const submitHandler = async () => {
    const credentials = new URLSearchParams();
    credentials.append('id', values.id);
    credentials.append('password', values.password);
    dispatch(setLoading());
    validationSchema.validate(values).catch(function (err) {
      dispatch(setLoading());
      showMessage({
        message: err.message,
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
      });
    });
    try {
      const response = await http.login(credentials);
      dispatch(login(response.data.results.token));
      dispatch(setLoading());
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
        hideOnPress: true,
      });
      navigation.navigate('TabScreen');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.authLogo}
          source={require('../assets/icons/Logo_Messenger_NewBlurple.png')}
        />
        <Text style={styles.headerTitle}>Welcome to</Text>
        <Text
          style={{
            ...styles.headerTitle,
            marginTop: -5,
          }}>
          Dyna Message
        </Text>
      </View>
      <View style={styles.body}>
        <KeyboardAwareScrollView>
          <TextInput
            style={{fontFamily: 'calibre'}}
            onChangeText={value =>
              setValues(current => {
                return {
                  ...current,
                  id: value,
                };
              })
            }
            value={values.id}
            placeholder="Write your email or username"
            keyboardType="email-address"
          />
          <View style={styles.line} />
          <TextInput
            style={{fontFamily: 'calibre'}}
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
            }}>
            <Text
              style={{
                ...text.center,
                ...text.white,
                ...text.heavy,
              }}>
              LOGIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              ...styles.button,
              backgroundColor: '#45CE4D',
            }}>
            <Text
              style={{
                ...text.center,
                ...text.white,
                ...text.heavy,
              }}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: 'white',
    height: '100%',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60%',
  },
  headerTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 10,
  },
  authLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  body: {
    minHeight: '40%',
  },
  line: {
    width: '100%',
    height: 0.9,
    backgroundColor: 'gray',
  },
  eye: {
    position: 'absolute',
    right: 0,
    top: 61,
    marginRight: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
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

export default Login;
