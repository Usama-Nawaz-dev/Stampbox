import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
isIphoneX = DeviceInfo.hasNotch();
import colors from '../../constant/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    height: hp(4),
    width: hp(4),
    borderRadius: hp(2.5),
    backgroundColor: colors.cWhite,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: isIphoneX && Platform.OS == 'ios' ? hp(5) : hp(4),
    left: hp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  icon: {
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightBlack,
  },
});
