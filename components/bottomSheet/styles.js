import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../../assets/fonts/Fonts';
import colors from '../../constant/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    height: hp(5),
    width: hp(5),
    borderRadius: hp(5),
    backgroundColor: colors.white,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: hp(1),
    position: 'absolute',
    top: Platform.OS == 'ios' ? hp(5) : hp(1),
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
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(2),
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    alignItems: "center"
  },
  closeButtonContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.IBM_Regular,
    fontWeight: '500',
    color: colors.lightBlack,
    marginLeft: hp(2)
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.cBlack,
  }
});
