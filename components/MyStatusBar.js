import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform } from 'react-native'
import React from 'react';
import colors from '../constant/colors';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

export default MyStatusBar

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
      },
      appBar: {
        backgroundColor: colors.theme,
        height: APPBAR_HEIGHT,
      },
})