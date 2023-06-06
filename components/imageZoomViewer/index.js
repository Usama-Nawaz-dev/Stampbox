import React, { useRef, useState } from 'react';
import { Modal, TouchableOpacity, StatusBar, Platform } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer-fixed';
import Fontisto from 'react-native-vector-icons/Fontisto';
import colors from '../../constant/colors';
import { styles } from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { View } from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
isIphoneX = DeviceInfo.hasNotch();
export const ImageZoomViewer = (props) => {
  const { images, visible, onPressClose, index } = props;
  return (
    <>
      {visible && (
        <StatusBar backgroundColor={colors.cWhite} barStyle="light-content" />
      )}
      <Modal visible={visible} transparent>
        <View style={[styles.container, { paddingTop: isIphoneX ? 17 : 0 }]}>
          <TouchableOpacity onPress={onPressClose} style={styles.mainContainer}>
            <Fontisto name="close-a" size={hp(1.5)} color={'#000'} />
          </TouchableOpacity>
          <ImageViewer index={index} imageUrls={images} />
        </View>
      </Modal>
    </>
  );
};

