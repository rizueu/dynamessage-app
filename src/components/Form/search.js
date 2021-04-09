import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Search = props => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Icon
          style={{marginLeft: 15, marginRight: 5}}
          color="gray"
          name="magnify"
          size={22}
        />
        {props.children}
      </View>
      {/* <TouchableOpacity style={styles.orderBy}>
        <Icon name="arrow-up" color="gray" size={20} />
      </TouchableOpacity> */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
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
  orderBy: {
    width: '10%',
  },
});
