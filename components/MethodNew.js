import { Button, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useRef, useImperativeHandle } from "react";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Child");
    },
  }));

  return (
    <View>
      <Text>Child</Text>
    </View>
  );
});

const Parent = () => {
  const childRef = useRef();

  return (
    <View>
      <Child ref={childRef} />
      <Button onPress={() => childRef.current.getAlert()}>Click</Button>
    </View>
  );
};
