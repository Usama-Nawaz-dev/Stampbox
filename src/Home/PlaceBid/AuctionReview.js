import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    StyleSheet, View, ActivityIndicator,
    FlatList, TextInput, TouchableOpacity,
    Keyboard
} from 'react-native';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../../constant/colors';
import AppText from '../../../components/AppText';
import { CommentCard, BottomSheet } from '../../../components';

import Helper from '../../Helper';
import Env from '../../../api/Env';
import MindAxios from '../../../api/MindAxios';
import allActions from '../../../redux/actions';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';
// import { dark as theme } from '../../../constant/colorsConfig';

export const AuctionReview = (props) => {
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const editSheetRef = useRef();

    const currentUser = useSelector((state) => state.ApiReducer.user);
    const auctionData = useSelector((state) => state.DetailReducer.auctionDetail);

    const [editCheck, setEditCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nextApiUrl, setNextApiUrl] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commentList, setCommentList] = useState(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [selectedComment, setSelectedComment] = useState(null);
    const{ myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);

    const onKeyboardDidShow = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    }

    const onKeyboardDidHide = () => {
        setKeyboardHeight(0);
    }

    useEffect(() => {
        if (focused) {
            fetchComments();
        } else { setCommentText(null) }
    }, [focused])

    const fetchComments = async () => {
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.get(
            Env.createUrl(
                `comments?commentable_id=${auctionData?.id}&commentable_type=Auction`
            )
        );
        // console.log("responseeee", response);
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status === 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            const _nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
            // console.log(_data,"next.....", _nextPageUrl);
            setCommentList(_data);
            setNextApiUrl(_nextPageUrl);

        } else {
            alert(language?.serverError);
        }
    };

    const nextPageComments = async () => {
        const response = await MindAxios.get(nextApiUrl + `&commentable_id=${auctionData?.id}&commentable_type=Trade`);
        if (response?.status === 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            const _nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
            // console.log(_data, "next.....", _nextPageUrl);
            setCommentList([...commentList, ..._data]);
            setNextApiUrl(_nextPageUrl);
        } else {
            alert(language?.serverError);
        }
    }

    const renderFooter = () => {
        return (
            isLoading ?
                <View >
                    <ActivityIndicator
                        size={"large"}
                        color={theme?.theme}
                        style={{ marginBottom: 20 }}
                    />
                </View>
                : null
        )
    };

    const handleLoadMore = () => {
        if (nextApiUrl !== null) {
            setIsLoading(true);
            nextPageComments();
        } else {
            setIsLoading(false);
        }
    }

    const postComment = async () => {
        if (commentText?.length) {
            dispatch(allActions.DataAction.AppLoader(true));
            const body = {
                commentable_type: 'Auction',
                commentable_id: auctionData?.id,
                message: commentText,
            };
            const response = await MindAxios.post(Env.createUrl(`comments`), body);
            // console.log("responseeee", response);
            dispatch(allActions.DataAction.AppLoader(false));
            if (response?.status === 200) {
                fetchComments();
                setCommentText("");
                // Helper.showToastMessage("Comment created sucessfully.", colors.green)
            } else {
                alert(language?.serverError);
            }
        } else {
            Helper.showToastMessage("Comment can't be empty", colors.blueTheme)
        }
    };

    const deleteComment = async () => {
        const response = await MindAxios.delete(
            Env.createUrl(`comments/${selectedComment?.id}`)
        );
        if (response?.status === 200) {
            fetchComments();
            setEditCheck(false);
            setSelectedComment(null);
            Helper.showToastMessage("Comment removed successfully", colors.green);
        } else {
            alert(language?.serverError);
        }
    };

    const updateComment = async () => {
        setEditCheck(false)
        const body = {
            message: commentText,
        };
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.post(
            Env.createUrl(`comments/${selectedComment?.id}`), body
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status === 200) {
            fetchComments();
            setCommentText("");
            Helper.showToastMessage("Comment updated successfully", colors.green);
        } else {
            alert(language?.serverError);
        }
    };

    const renderComments = ({ item, index }) => {
        return (
            <CommentCard item={item}
                onPressOption={() => {
                    console.log(item)
                    editSheetRef?.current?.open();
                    setSelectedComment(item);
                }} />
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            {commentList?.length ?
                <FlatList
                    inverted
                    data={commentList}
                    key={key => key.id}
                    renderItem={renderComments}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                /> :
                <View style={styles.mainItem}>
                    <AppText style={styles.itemText}>Auction don't have any reviews.</AppText>
                </View>
            }
            <View style={[styles.inputSection,
            { paddingBottom: keyboardHeight ? keyboardHeight : hp(1), }]}>
                <TextInput
                    multiline
                    value={commentText}
                    style={styles.input}
                    placeholder={language?.write_a_comment+"..."}
                    placeholderTextColor={theme?.darkGrey}
                    color={theme?.darkGrey}
                    onChangeText={(val) => setCommentText(val)}

                />
                <TouchableOpacity style={styles.submitBtn}
                    onPress={() => {
                        if (editCheck) {
                            updateComment();
                        } else {
                            postComment();
                        }
                    }}>
                    <Feather name='send' size={20} color={colors.cWhite} />
                </TouchableOpacity>
            </View>

            {/* Edit Comment Sheet*/}
            <BottomSheet
                ref={editSheetRef}
                borderRadius={1}
                sheetHeight={hp(25)}
                ChildComponent={
                    <View style={styles.bottomSheetView}>
                        <TouchableOpacity
                            onPress={() => {
                                setCommentText(selectedComment?.message);
                                editSheetRef?.current?.close();
                                setEditCheck(true);
                            }}
                        >
                            <View style={styles.bottomSheetOptionView}>
                                <Feather name="edit" size={30} />
                                <AppText style={styles.bottomSheetText}>Edit Comment</AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                deleteComment();
                                editSheetRef?.current?.close();
                            }}
                        >
                            <View style={styles.bottomSheetOptionView}>
                                <AntDesign name="delete" size={30} />
                                <AppText style={styles.bottomSheetText}>Delete Comment</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(1),
        backgroundColor: colors.cWhite
    },
    mainItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: colors.cWhite,
    },
    itemText: {
        fontSize: 12,
        fontWeight: "500",
        color: colors.lightTheme,
    },

    inputSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
    },
    input: {
        height: 50,
        width: '80%',
        fontSize: 14,
        paddingTop: hp(1.5),
        color: colors.lightText,
        paddingHorizontal: wp(1),
        fontFamily: Fonts.Inter_Regular
    },
    submitBtn: {
        // height: 40,
        padding: 7,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: colors.lightTheme
    },
    submitText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.cWhite,
        paddingHorizontal: wp(2.5)
    },

    // Bottom Sheet Styles
    bottomSheetView: {
        padding: 20,
        justifyContent: "center",
        marginLeft: 10,
    },
    bottomSheetText: {
        fontSize: 20,
        marginLeft: 20,
        color: colors.btnText
    },
    bottomSheetOptionView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
})