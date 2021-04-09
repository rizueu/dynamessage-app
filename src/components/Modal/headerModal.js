import React from 'react';
import {View, Text, Modal} from 'react-native';

const HeaderModal = props => {
  return (
    <Modal {...props}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        {props.children}
      </View>
    </Modal>
  );
};

export default HeaderModal;
