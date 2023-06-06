import React, { useContext } from 'react';
import {Text} from 'react-native';
import defaultStyles from '../constant/styles';
import ThemeContext from '../src/Context/ThemeContext';
// import { dark as theme } from '../constant/colorsConfig';

export default function AppText({children, style, ...otherProps}) {
  const { theme, mode } = useContext(ThemeContext);
  // let tst = true;
  return (
    <Text style={[defaultStyles.text, { color :  theme?.darkGrey} ,style]} {...otherProps}>
      {children}
    </Text>
  );
}
