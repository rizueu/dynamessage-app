// Import modules
import React, {Fragment} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import FlashMessage from 'react-native-flash-message';

// Import screens
// import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Activate from './screens/Activate';
import Profile from './screens/Profile';
import RoomChat from './screens/RoomChat';

// Import components
import {Header, Loading} from './components';

const Stack = createStackNavigator();
import TabScreen from './TabScreen';

export default function StackScreen() {
  const token = useSelector(state => state.auth.token);
  return (
    <Fragment>
      <NavigationContainer>
        <Stack.Navigator>
          {token ? (
            <Fragment>
              <Stack.Screen
                name="TabScreen"
                component={TabScreen}
                options={{
                  header: () => <Header />,
                }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                }}
              />
            </Fragment>
          ) : (
            <Fragment>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="TabScreen"
                component={TabScreen}
                options={{
                  header: () => <Header />,
                }}
              />
            </Fragment>
          )}
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              header: () => <Header auth />,
            }}
          />
          <Stack.Screen
            name="Activate"
            component={Activate}
            options={{
              header: () => <Header auth />,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{title: 'Saya'}}
          />
          <Stack.Screen
            name="RoomChat"
            component={RoomChat}
            options={({route}) => ({
              headerTitle: props => (
                <Header {...props} chat senderId={route.params.senderId} />
              ),
            })}
          />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
      <Loading />
    </Fragment>
  );
}
