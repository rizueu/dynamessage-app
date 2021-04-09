import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useSelector, useDispatch} from 'react-redux';
import {refresh} from '../redux/actions/auth';

// Import components
import {SearchForm} from '../components';

// Import Services
import http from '../services';

const Contact = () => {
  const [state, setState] = useState({
    page: 1,
    loading: true,
    loadingMore: false,
  });
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState([]);
  const token = useSelector(state => state.auth.token);
  const isRefresh = useSelector(state => state.auth.isRefresh);

  const dispatch = useDispatch();

  const handleLoadMore = () => {
    setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true,
      }),
      () => {
        getContact(`/friends?limit=1&page=${state.page}`);
      },
    );
  };

  React.useEffect(() => {
    const getContact = async url => {
      try {
        const {data} = await http.getContact(token, url);
        setFriends(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    getContact(`/friends?/friends?limit=1&search=${keyword}`);
  }, [keyword, token]);

  return (
    <View style={styles.body}>
      <View style={style.container}>
        <View style={style.body}>
          <Icon
            style={{marginLeft: 15, marginRight: 5}}
            color="gray"
            name="magnify"
            size={22}
          />
          <TextInput
            style={style.formSearch}
            onChangeText={value => setKeyword(value)}
            placeholder="Search"
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
        data={friends}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              height: 70,
              display: 'flex',
              justifyContent: 'center',
              borderBottomWidth: 0.5,
              borderBottomColor: 'gray',
            }}>
            <View style={styles.container}>
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
                    uri: `http://23.21.108.250:8080/profile/${item.user.picture}`,
                  }}
                />
                <Text style={{marginLeft: 10}}>{item.user.name}</Text>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  Alert.alert(
                    `Delete ${item.user.name}?`,
                    'are you sure, want to delete your friends?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        onPress: async () => {
                          await http.deleteFriend(token, item.id);
                          dispatch(refresh());
                        },
                      },
                    ],
                  );
                }}>
                {/* <Icon name="account-remove" size={20} /> */}
                <Text style={{fontSize: 25}}>x</Text>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    display: 'flex',
    flexDirection: 'row',
  },
  body: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  formSearch: {
    width: '100%',
    fontSize: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  body: {
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height,
  },
});

export default Contact;
