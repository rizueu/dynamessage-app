import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RoomChat = () => {
  const DATA = [
    {
      id: 5,
      userId: 1,
      senderId: 4,
      message: 'Hello',
      createdAt: '2021-03-13T10:31:31.000Z',
      updatedAt: '2021-03-13T10:31:31.000Z',
    },
    {
      id: 4,
      userId: 1,
      senderId: 4,
      message: 'Sehat bro?',
      createdAt: '2021-03-13T09:42:57.000Z',
      updatedAt: '2021-03-14T08:55:01.000Z',
    },
    {
      id: 3,
      userId: 1,
      senderId: 4,
      message: 'Halo, apa kabar?',
      createdAt: '2021-03-13T09:41:43.000Z',
      updatedAt: '2021-03-14T08:54:52.000Z',
    },
  ];

  return (
    <SafeAreaView style={styles.body}>
      <FlatList
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
        data={DATA}
        keyExtractor={item => item.id.toString()}
      />
      <View style={messageInput.body}>
        <TextInput
          multiline
          style={messageInput.form}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={{marginRight: -5}}>
          <Icon name="send" color="#1687a7" size={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoomChat;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: '100%',
  },
});

const messageInput = StyleSheet.create({
  body: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 20,
    fontSize: 16,
    paddingLeft: 20,
  },
});
