import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import http from '../services';

import {useDispatch, useSelector} from 'react-redux';
import {setTab} from '../redux/actions/main';

const Chats = () => {
  const navigation = useNavigation();

  const token = useSelector(state => state.auth.token);

  const [chatLists, setChatLists] = useState([]);

  React.useEffect(() => {
    const getChatLists = async () => {
      try {
        const {data} = await http.getChatLists(token);
        setChatLists(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    getChatLists();
  }, [token]);

  return (
    <View style={styles.body}>
      {chatLists.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
          data={chatLists}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RoomChat', {senderId: item.senderId})
              }
              style={{
                height: 60,
                display: 'flex',
                justifyContent: 'center',
              }}>
              <View style={styles.container}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Image
                      style={{borderRadius: 50}}
                      source={{
                        width: 40,
                        height: 40,
                        uri: `http://23.21.108.250:8080/profile/${item['user.picture']}`,
                      }}
                    />
                    <View style={{marginLeft: 15}}>
                      <Text style={{fontSize: 16}}>{item['user.name']}</Text>
                      <Text style={{color: 'gray'}}>{item.message}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{color: 'gray', fontSize: 13}}>
                      {item.createdAt}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{marginTop: 50}}>Chats not found!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    minHeight: Dimensions.get('window').height,
  },
});

export default Chats;
