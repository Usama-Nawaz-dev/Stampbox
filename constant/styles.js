import colors from './colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../assets/fonts/Fonts';
export default {
  text: {
    // fontFamily: 'Inter-Regular',
    color: colors.cBlack,
    fontFamily: Fonts.IBM_Regular
  },
  textInput: {
    width: '100%',
    color: colors.btnText,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    height: 40,
  },
  backButton: {
    position: 'absolute',
    left: wp(5),
    top: hp(4),
  },
  updateBackButton: {
    position: 'absolute',
    left: wp(5),
    top: hp(2),
  },
  semiBold: {
    // fontFamily: 'Quicksand-SemiBold',
  },
  bold: {
    // fontFamily: 'Quicksand-Bold',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};
