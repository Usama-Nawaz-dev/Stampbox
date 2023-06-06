import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import AppText from "./AppText";

import Icon from "react-native-vector-icons/Ionicons";
import Image from "react-native-fast-image";

import { Svg, Path } from "react-native-svg";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Header = (props) => {
  const { title,
    label,
    onPress,
    left,
    icon = false,
    multiple = false,
    onRightIconPress,
    onAdd, onDelete, onEdit,
    iconRight } = props
  return (
    <View style={{ overflow: "hidden" }}>
      <Svg
        // style={{ backgroundColor: "transparent", overflow: "hidden" }}
        width={"100%"}
        height={60}
      >
        <Path
          strokeWidth={1}
          stroke="#dbd6ca"
          d="M0,60V0H450V60h-.3c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.57,0-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.82.54-2.82,1.19h-.78c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.83,1.19H424c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19S399,59.34,399,60h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19H379c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.57,0-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.82-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.82.54-2.82,1.19h-.78c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19H334c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19S309,59.34,309,60h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.82-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.83.54-2.82,1.19h-.78c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19S219,59.34,219,60h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.57,0-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.82.54-2.82,1.19H186c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19H141c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.57,0-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.82-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.82.54-2.82,1.19h-.78c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.83,1.19H96c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19h-.76c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19H76.7c0-.66-1.27-1.19-2.83-1.19S71,59.34,71,60h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19H63.8c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19s-2.83.53-2.84,1.19H51c0-.66-1.27-1.19-2.84-1.19s-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.82-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.26-1.19-2.83-1.19h0c-1.56,0-2.83.53-2.83,1.19h-.77c0-.66-1.27-1.19-2.83-1.19h0c-1.56,0-2.83.54-2.82,1.19h-.78c0-.65-1.26-1.19-2.82-1.19s-2.83.53-2.84,1.19H12.4c0-.66-1.27-1.19-2.84-1.19S6.73,59.34,6.73,60H6c0-.66-1.27-1.19-2.83-1.19S.3,59.34.3,60Z"
          fill="#dbd6ca"
        />
      </Svg>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        position: "absolute",
        width: '90%',
        // backgroundColor: 'red',
        top: 13,
        left: left ? left : 15,
      }}>
        <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="arrow-back-sharp" size={30} color="#000" />
          <AppText style={{ fontWeight: "500", fontSize: 20, marginHorizontal: 15 }}>
            {title}
          </AppText>
        </Pressable>
        {multiple ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{marginRight: 20}} onPress={onEdit}>
              <MaterialIcons name="edit" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 20}} onPress={onDelete}>
              <AntDesign name="delete" size={18} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAdd}>
              <Octicons name="plus-circle" size={18} />
            </TouchableOpacity>
          </View>
        ) :
          (icon ? <Pressable onPress={onRightIconPress}>
            {iconRight ? iconRight :
              <SimpleLineIcons name="plus" size={16} />}
          </Pressable> : null)}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
