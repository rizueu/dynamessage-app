import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import http from '../services';

import {useSelector, useDispatch} from 'react-redux';
import {reset_token, refresh} from '../redux/actions/auth';
import {setLoading} from '../redux/actions/main';

import {ProfileModal} from '../components';

const Profile = () => {
  const [error, setError] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [previous, setPrevious] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalUsername, setModalUsername] = useState(false);
  const [modalName, setModalName] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);

  const token = useSelector(state => state.auth.token);
  const isRefresh = useSelector(state => state.auth.isRefresh);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const editUsername = async () => {
    const data = new URLSearchParams();
    data.append('username', username);
    try {
      const response = await http.editUser(token, data);
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
        hideOnPress: true,
      });
    } catch (error) {
      showMessage({
        message: error.response.data.message,
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
      });
    }
  };

  const editName = async () => {
    const data = new URLSearchParams();
    data.append('name', name);
    try {
      const response = await http.editUser(token, data);
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
        hideOnPress: true,
      });
    } catch (error) {
      showMessage({
        message: error.response.data.message,
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
      });
    }
  };

  const changePassword = async () => {
    const data = new URLSearchParams();
    data.append('prevPassword', previous);
    data.append('password', newPassword);
    try {
      setError(null);
      const response = await http.editPassword(token, data);
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
        hideOnPress: true,
      });
    } catch (error) {
      setError(error.response.data.message);
      // showMessage({
      //   message: error.response.data.message,
      //   type: 'danger',
      //   duration: 3000,
      //   hideOnPress: true,
      // });
    }
  };

  const handleImgLib = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      async response => {
        if (response.uri) {
          if (response.fileSize > 2000000) {
            setVisible(!isVisible);
            showMessage({
              message: 'Photo size must be lower than 2mb',
              type: 'warning',
              duration: 2000,
              hideOnPress: true,
            });
          } else {
            const formData = new FormData();
            formData.append('picture', {
              uri: response.uri,
              type: response.type,
              name: response.fileName,
            });
            setVisible(!isVisible);
            dispatch(setLoading());
            try {
              const {data} = await http.upload(token, formData);
              dispatch(setLoading());
              showMessage({
                message: data.message,
                type: data.success ? 'success' : 'warning',
                duration: 2000,
                hideOnPress: true,
              });
              dispatch(refresh());
            } catch (err) {
              console.log(err);
              dispatch(setLoading());
              showMessage({
                message: err.response.data.message,
                type: err.response.data.success ? 'success' : 'warning',
                duration: 2000,
                hideOnPress: true,
              });
            }
          }
        }
      },
    );
  };

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      async response => {
        if (response.uri) {
          const formData = new FormData();
          formData.append('picture', {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          });
          setVisible(!isVisible);
          dispatch(setLoading());
          try {
            const {data} = await http.upload(token, formData);
            dispatch(setLoading());
            showMessage({
              message: data.message,
              type: data.success ? 'success' : 'warning',
              duration: 2000,
              hideOnPress: true,
            });
            dispatch(refresh());
          } catch (err) {
            console.log(err);
            dispatch(setLoading());
            showMessage({
              message: err.response.data.message,
              type: err.response.data.success ? 'success' : 'warning',
              duration: 2000,
              hideOnPress: true,
            });
          }
        }
      },
    );
  };

  React.useEffect(() => {
    const getUser = async () => {
      const response = await http.getUser(token);
      setUser(response.data.results);
    };
    getUser();
  }, []);

  return (
    <View style={styles.body}>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={style.modalFlex}>
          <View style={style.modal}>
            <View style={style.containerModal}>
              <TouchableOpacity style={style.button} onPress={handleImgLib}>
                <Text style={{color: 'white'}}>Choose From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.button} onPress={handleCamera}>
                <Text style={{color: 'white'}}>Take a Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.button}
                onPress={() => setVisible(!isVisible)}>
                <Text style={{color: 'white'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            display: 'flex',
            paddingVertical: 30,
          }}>
          <TouchableWithoutFeedback onPress={() => setVisible(!isVisible)}>
            <Image
              style={{borderRadius: 70}}
              source={{
                width: 130,
                height: 130,
                uri: user.picture,
              }}
            />
          </TouchableWithoutFeedback>
          <Text
            style={{
              fontSize: 25,
              marginTop: 10,
              ...text.bold,
            }}>
            {!user.name ? '-' : user.name}
          </Text>
        </View>
      </View>
      <View>
        <Text style={text.subText}>Profil</Text>
        <TouchableOpacity
          onPress={() => setModalUsername(true)}
          style={{
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <View style={styles.container}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{...styles.iconBg, backgroundColor: '#ff7171'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginTop: -4,
                    color: 'white',
                  }}>
                  @
                </Text>
              </View>
              <View>
                <Text style={{...text.title, marginLeft: 10}}>
                  Nama Pengguna
                </Text>
                <Text style={{marginLeft: 10, color: 'gray'}}>
                  /{user.username}
                </Text>
                <ProfileModal
                  animationType="slide"
                  transparent={true}
                  visible={modalUsername}
                  onRequestClose={() => {
                    setModalUsername(!modalUsername);
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      marginTop: 30,
                      marginBottom: 10,
                    }}>
                    Username
                  </Text>
                  <View style={{paddingHorizontal: 20}}>
                    <TextInput
                      style={styles.input}
                      onChangeText={value => setUsername(value)}
                      value={username}
                    />
                    <TouchableOpacity
                      onPress={() => editUsername()}
                      style={{
                        ...styles.button,
                        marginTop: 20,
                        backgroundColor: '#ff7171',
                      }}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        Save
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 10,
                        marginTop: 20,
                      }}>
                      Your username becomes part of your custom links that let
                      people visit your Dynamessage profile and reach you on
                      Dynamessage.
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 10,
                        marginTop: 10,
                      }}>
                      Need help?{' '}
                      <Text style={{color: 'blue'}}>
                        Get tips on choosing a username.
                      </Text>
                    </Text>
                  </View>
                </ProfileModal>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalName(true)}
          style={{
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <View style={styles.container}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{...styles.iconBg, backgroundColor: '#9fd8df'}}>
                <Icon name="pencil" color="white" size={18} />
              </View>
              <Text style={{...text.title, marginLeft: 10}}>
                Ubah Nama Anda
              </Text>
              <ProfileModal
                animationType="slide"
                transparent={true}
                visible={modalName}
                onRequestClose={() => {
                  setModalName(!modalName);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginTop: 30,
                    marginBottom: 10,
                  }}>
                  Ubah Nama Anda
                </Text>
                <View style={{paddingHorizontal: 20}}>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => setName(value)}
                    value={name}
                  />
                  <TouchableOpacity
                    onPress={() => editName()}
                    style={{
                      ...styles.button,
                      marginTop: 20,
                      backgroundColor: '#9fd8df',
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Save
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 10,
                      marginTop: 20,
                    }}>
                    Your Name becomes part of your custom links that let people
                    visit your Dynamessage profile and reach you on Dynamessage.
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 10,
                      marginTop: 10,
                    }}>
                    Need help?{' '}
                    <Text style={{color: 'blue'}}>
                      Get tips on choosing a Name.
                    </Text>
                  </Text>
                </View>
              </ProfileModal>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={text.subText}>Akun</Text>
        <TouchableOpacity
          onPress={() => setModalChangePassword(true)}
          style={{
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <View style={styles.container}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{...styles.iconBg, backgroundColor: '#000'}}>
                <Icon name="lock-outline" color="white" size={18} />
              </View>
              <Text style={{...text.title, marginLeft: 10}}>Ubah Password</Text>
              <ProfileModal
                animationType="slide"
                transparent={true}
                visible={modalChangePassword}
                onRequestClose={() => {
                  setModalChangePassword(!modalChangePassword);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginTop: 30,
                    marginBottom: 10,
                  }}>
                  Change Password
                </Text>
                <View style={{paddingHorizontal: 20}}>
                  <Text style={styles.inputLabel}>Previous Password</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => setPrevious(value)}
                    value={previous}
                    secureTextEntry={true}
                  />
                  <Text
                    style={{
                      ...styles.inputLabel,
                      marginTop: 20,
                    }}>
                    New Password
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={value => setNewPassword(value)}
                    value={newPassword}
                    secureTextEntry={true}
                  />
                  <TouchableOpacity
                    onPress={() => changePassword()}
                    style={{
                      ...styles.button,
                      marginTop: 20,
                      backgroundColor: '#000',
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                  {error ? (
                    <Text
                      style={{
                        color: 'red',
                        textAlign: 'center',
                        marginTop: 10,
                      }}>
                      {error}
                    </Text>
                  ) : null}
                </View>
              </ProfileModal>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Logout', 'are you sure, want to exit?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: () => {
                  dispatch(reset_token());
                  navigation.navigate('Login');
                },
              },
            ]);
          }}
          style={{
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <View style={styles.container}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{...styles.iconBg, backgroundColor: '#7868e6'}}>
                <Icon
                  style={{marginRight: -2}}
                  name="logout"
                  color="white"
                  size={18}
                />
              </View>
              <Text style={{...text.title, marginLeft: 10}}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const style = StyleSheet.create({
  modal: {
    height: 300,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFlex: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: (100 / 100) * Dimensions.get('screen').height,
    width: (100 / 100) * Dimensions.get('screen').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    width: '80%',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
  },
  body: {
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height,
  },
  iconBg: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  input: {
    borderBottomWidth: 3,
  },
  button: {
    width: '100%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  inputLabel: {
    color: 'gray',
  },
});

const text = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  subText: {
    color: 'gray',
    paddingLeft: 25,
    marginVertical: 14,
  },
});
