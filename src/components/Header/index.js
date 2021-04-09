import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import http from '../../services';

import {useSelector, useDispatch} from 'react-redux';
import {refresh} from '../../redux/actions/auth';

// Import Components
import {HeaderModal, SearchForm} from '../';

const Header = props => {
  const [onModal, setOnModal] = useState('');
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [friend, setFriend] = useState({});
  const [friends, setFriends] = useState([
    {
      id: 1,
      userId: 1,
      friendId: 4,
      createdAt: '2021-03-14T09:37:36.000Z',
      updatedAt: '2021-03-14T10:40:09.000Z',
      user: {
        name: 'Example',
        picture: 'nophoto.png',
      },
    },
    {
      id: 2,
      userId: 1,
      friendId: 5,
      createdAt: '2021-03-14T09:37:36.000Z',
      updatedAt: '2021-03-14T10:40:09.000Z',
      user: {
        name: 'Rizki Ramadhan',
        picture: 'nophoto.png',
      },
    },
  ]);
  const [newFriend, setNewFriend] = useState([]);

  const token = useSelector(state => state.auth.token);
  const isRefresh = useSelector(state => state.auth.isRefresh);
  const onTab = useSelector(state => state.main.onTab);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addFriend = async () => {
    setOnModal('addFriend');
    setModalVisible(true);
  };

  const newMessage = () => {
    setOnModal('newMessage');
    setModalVisible(true);
  };

  React.useEffect(() => {
    if (token) {
      const getAllContact = async () => {
        try {
          const {data} = await http.getAllContact(token, keyword);
          setNewFriend(data.results);
          dispatch(refresh());
        } catch (error) {}
      };
      getAllContact();
    }
  }, [keyword, token]);

  React.useEffect(() => {
    if (token) {
      const getFriend = async () => {
        try {
          const response = await http.getFriendById(token, props.senderId);
          dispatch(refresh());
          setFriend(response.data.results);
        } catch (error) {
          console.error(error);
        }
      };
      getFriend();
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const response = await http.getUser(token);
          dispatch(refresh());
          setUser(response.data.results);
        } catch (error) {
          console.error(error);
        }
      };
      getUser();
    }
  }, [token]);

  if (props.auth) {
    return (
      <View style={styles.body}>
        <Image
          style={styles.navBrand}
          source={require('../../assets/icons/M_logo_Black.png')}
        />
        <Text style={text.header}>DynaMessage</Text>
      </View>
    );
  } else if (props.chat) {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -10,
        }}>
        <Image
          style={{borderRadius: 20}}
          source={{
            width: 40,
            height: 40,
            uri: `http://23.21.108.250:8080/profile/${friend.picture}`,
          }}
        />
        <View>
          <Text style={{marginLeft: 15, fontSize: 16}}>{friend.name}</Text>
          <Text style={{marginLeft: 15, fontSize: 12, color: 'gray'}}>
            @{friend.username}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <React.Fragment>
        <View
          style={{
            ...styles.body,
            justifyContent: 'space-between',
          }}>
          <View style={styles.leftItems}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user.picture,
                }}
              />
            </TouchableOpacity>
            <Text style={text.title}>
              {onTab === 'Chat' ? 'Chats' : 'Contact'}
            </Text>
          </View>
          <View style={styles.rightItems}>
            <TouchableOpacity
              onPress={onTab === 'Contact' ? addFriend : newMessage}
              style={styles.bgIcon}>
              <Icon
                name={onTab === 'Chat' ? 'pencil' : 'account-plus'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <HeaderModal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {onModal === 'addFriend' ? 'Discover People' : 'New Message to :'}
            </Text>
            <SearchForm>
              <TextInput
                style={styles.formSearch}
                onChangeText={value => setKeyword(value)}
                value={keyword}
                placeholder="Search"
              />
            </SearchForm>
            {onModal === 'Chat' ? (
              friends.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                  }}
                  data={friends}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'gray',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 25,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={{borderRadius: 50}}
                            source={{
                              width: 40,
                              height: 40,
                              uri: `http://23.21.108.250:8080/profile/nophoto.png`,
                            }}
                          />
                          <Text style={{marginLeft: 10}}>Rizki Ramadhan</Text>
                        </View>
                        {onModal === 'addFriend' ? (
                          <TouchableWithoutFeedback>
                            <Icon name="account-plus" size={20} />
                          </TouchableWithoutFeedback>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    marginTop: 50,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'gray',
                      fontSize: 18,
                    }}>
                    No friends.
                  </Text>
                </View>
              )
            ) : newFriend.length > 0 ? (
              <FlatList
                contentContainerStyle={{
                  flex: 1,
                  flexDirection: 'column',
                  height: '100%',
                  width: '100%',
                }}
                data={newFriend}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      height: 70,
                      display: 'flex',
                      justifyContent: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'gray',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 25,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{borderRadius: 50}}
                          source={{
                            width: 40,
                            height: 40,
                            uri: `http://23.21.108.250:8080/profile/${item.picture}`,
                          }}
                        />
                        <Text style={{marginLeft: 10}}>{item.name}</Text>
                      </View>
                      {onModal === 'addFriend' ? (
                        <TouchableWithoutFeedback>
                          <Icon name="account-plus" size={20} />
                        </TouchableWithoutFeedback>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  marginTop: 50,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'gray',
                    fontSize: 18,
                  }}>
                  No friends.
                </Text>
              </View>
            )}
          </View>
        </HeaderModal>
      </React.Fragment>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 25,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBrand: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 25,
  },
  leftItems: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    resizeMode: 'contain',
  },
  bgIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '65%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
    fontSize: 20,
  },
  formSearch: {
    width: '100%',
    fontSize: 15,
  },
});

const text = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 80,
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 26,
  },
});

export default Header;
