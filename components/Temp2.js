import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    View,
    TextInput,
    Animated,
    StyleSheet
} from 'react-native';

import colors from '../constant/colors';
import Fonts from '../assets/fonts/Fonts';

export function FloatingInput(props) {
    // const { label } = props;
    // state = {
    //     isFocused: false,
    // };
    // var animatedIsFocused = 0;
    const [isFocused, setFocus] = useState(false);
    const [animatedIsFocused, setAnimatedVal] = useState(new Animated.Value(0));
    // useEffect(() => {
    //     setAnimatedVal(new Animated.Value(props.value === '' ? 0 : 1));
    // }, []);

    // componentWillMount() {
    //     this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
    // }

    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);

    // componentDidUpdate() {
    //     Animated.timing(this._animatedIsFocused, {
    //         toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
    //         duration: 200,
    //     }).start();
    // }
    useEffect(() => {
        // animatedIsFocused = 
        if(props.value === ''){
            setAnimatedVal(new Animated.Value(0));
        }else{
            setAnimatedVal(new Animated.Value(1));
        }
    })

    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: (isFocused || props.value !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }, [props.value])




    const labelStyle = {
        position: 'absolute',
        left: 0,
        top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [18, 0],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 12],
        }),
        color: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.placeholderText, colors.placeholderText],
        }),
    };
    return (
        <View style={{ paddingTop: 18 }}>
            <Animated.Text style={labelStyle}>
                {props.label}
            </Animated.Text>
            <TextInput
                {...props}
                style={[styles.input,
                {
                    borderBottomColor: isFocused ?
                        colors.theme : colors.borderColor
                }]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                blurOnSubmit
            />
        </View>
    );
}


const styles = StyleSheet.create({
    input: {
        height: 30,
        fontSize: 14,
        color: colors.btnText,
        fontFamily: Fonts.Roboto_Regular,
        borderBottomWidth: 1,
        marginBottom: 15
    },
    label: {

    }
})