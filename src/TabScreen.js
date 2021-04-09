import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {setTab} from './redux/actions/main';

// Import Screens
import Chats from './screens/Chats';
import Contact from './screens/Contact';

// Import Components
import {TouchableOpacity, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{
        activeTintColor: '#000',
      }}>
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              style={styles.buttonTabs}
              onPress={() => {
                dispatch(setTab('Chat'));
                navigation.navigate('Chats');
              }}></TouchableOpacity>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="comment" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          tabBarLabel: 'Contact',
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              style={styles.buttonTabs}
              onPress={() => {
                dispatch(setTab('Contact'));
                navigation.navigate('Contact');
              }}></TouchableOpacity>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon name="users" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  buttonTabs: {
    width: '50%',
  },
});
