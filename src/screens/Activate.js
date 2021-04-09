import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {Formik} from 'formik';
import * as Yup from 'yup';
import http from '../services';

import {useSelector, useDispatch} from 'react-redux';
import {setLoading} from '../redux/actions/main';

const Activate = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const [values, setValues] = useState({
    OTP: '',
  });
  const {id, OTP} = route.params;

  const validationSchema = Yup.object().shape({
    OTP: Yup.string().required('OTP cannot be empty!'),
  });

  const handleSubmit = async () => {
    dispatch(setLoading());
    if (values.OTP !== OTP) {
      dispatch(setLoading());
      showMessage({
        message: "OTP doesn't matched",
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
      });
    } else {
      try {
        const response = await http.activate(id);
        dispatch(setLoading());
        showMessage({
          message: response.data.message,
          type: 'success',
          duration: 3000,
          hideOnPress: true,
        });
        navigation.navigate('Login');
      } catch (error) {
        dispatch(setLoading());
        showMessage({
          message: error.response.data.message,
          type: 'danger',
          duration: 3000,
          hideOnPress: true,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={text.center}>
          Activate your account, enter the OTP code that was sent by email.
          please check your email!
        </Text>
        <React.Fragment>
          <TextInput
            style={styles.input}
            onChangeText={value =>
              setValues(current => {
                return {
                  ...current,
                  OTP: value,
                };
              })
            }
            value={values.OTP}
            keyboardType="number-pad"
            placeholder="Write your OTP"
          />
          <TouchableOpacity
            onPress={() => handleSubmit()}
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
              Activate
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
  },
  body: {
    paddingTop: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
  },
  input: {
    textAlign: 'center',
    marginVertical: 30,
    fontWeight: 'bold',
    fontSize: 16,
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

export default Activate;
