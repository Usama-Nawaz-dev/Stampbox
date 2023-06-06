import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../constant/colors";

export const styles = StyleSheet.create({
    header: {
        height: hp(7),
        width: wp(100),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: '#555',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#fff'
    },
    commentView: {
        // height: '100%',
        // backgroundColor: '#777',
        padding: 10,
        flex: 1,
        justifyContent: "space-between",
    },
    CCard: {
        width: wp(100),
        flexDirection: 'row',
        // alignItems: "center",
        marginBottom: 7,
    },
    CCImage: {
        height: 45,
        width: 45,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.heading,
    },
    commentText: {
        fontSize: 12,
        maxWidth: wp(80),
        marginTop: hp(0.5),
        color: colors.lightText
    },
    dotIcon: {
        top: wp(1),
        right: wp(0.5),
        paddingHorizontal: wp(1.5),
        position: 'absolute'
    },
    text: {
        color: colors.lightText,
        marginTop: 20,
    },
    input: {
        padding: 8,
        width: "85%",
        fontSize: 12,
        marginLeft: 15,
    },
    commentBlock: {
        marginLeft: 5,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp(81)
    },
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
    inputIcon: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.theme,
        borderRadius: 25,
    }
})