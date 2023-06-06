import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BorderBtn from './BorderBtn'

const EmptyState = ({desc, onPress}) => {
  return (
    <View
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}>
      Request not found
    </Text>
    <Text
      style={{
        fontSize: 14,
        color: "grey",
        marginHorizontal: 20,
        textAlign: "center",
        marginTop: 10,
      }}
    >
      {desc}
    </Text>
    <BorderBtn
      label="Retry"
      height={40}
      width={100}
      color="lightgrey"
      backgroundColor="transparent"
      fontColor="grey"
      fontSize={14}
      noRadius={true}
      top={10}
      onPress={onPress}
    />
  </View>
  )
}

export default EmptyState

const styles = StyleSheet.create({})