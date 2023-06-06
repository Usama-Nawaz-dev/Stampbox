import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity } from "react-native";
import React from "react";

import Icon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { Svg, Path } from "react-native-svg";
import colors from "../constant/colors";

import SearchBar from "./SearchBar";
import AppText from "./AppText";

const IconsHeader = (props) => {
    const {
        title, placeholder, onPressBack, filter, onPressCart, onPressAdd,
        search, multiple, rightIconPress } = props
    return (
        <View
            style={[styles.container, { height: search ? 120 : 60 }]}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <Pressable onPress={onPressBack} style={styles.leftSection}>
                    <Icon name="arrow-back-sharp" size={30} style={{ marginHorizontal: 10 }} />
                    <Text style={styles.titleText}> {title} </Text>
                </Pressable>
                {multiple ? (<View style={styles.iconSection1}>
                    <TouchableOpacity style={styles.optionIcon1} onPress={onPressAdd}>
                        <SimpleLineIcons name="plus" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionIcon1} onPress={onPressCart}>
                        <Ionicons name="cart-outline" size={22} />
                    </TouchableOpacity>
                    <Pressable onPress={rightIconPress}>
                        <Entypo name="dots-three-vertical" size={16} />
                    </Pressable>
                </View>) :
                    (<View style={styles.iconSection}>
                        <TouchableOpacity style={styles.optionIcon}>
                            <Ionicons name="ios-options" size={18}
                                style={{ transform: [{ rotateY: '180deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={rightIconPress}>
                            <Entypo name="dots-three-vertical" size={22} />
                        </TouchableOpacity>
                    </View>)}
            </View>
            {search && (
                <View style={styles.searchSection}>
                    <SearchBar
                        onTermChange={(text) => {
                            // console.log("text->", text);
                            //   searchData(text);
                        }}
                        onTermSubmit={(text) => {
                            // console.log("text->", text);
                            //   searchData(text);
                        }}
                        placeholder={placeholder ? placeholder : "Search"}
                        borderRadius={10}
                        otherIcon={true}
                        filter={filter}
                    />
                </View>
            )}
        </View>
    );
};

export default IconsHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#dbd6ca",
        justifyContent: "space-around",
        // marginHorizontal: 10
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    titleText: {
        fontSize: 21,
        fontWeight: "500",
        fontFamily: "Roboto-Regular",
    },
    iconSection: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        width: '20%',
        justifyContent: "space-between",
    },
    iconSection1: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        width: '28%',
        justifyContent: "space-between",
    },
    searchSection: {
        height: 50,
        width: "100%",
        justifyContent: "center"
    },
    optionIcon: {
        backgroundColor: "rgba(255,255,255,.5)",
        padding: 5,
        borderRadius: 10
    },
    optionIcon1: {
        backgroundColor: "rgba(255,255,255,.1)",
        padding: 2,
        borderRadius: 10,
        // opacity: 0.5
    }
});
