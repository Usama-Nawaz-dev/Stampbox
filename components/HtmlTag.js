import { View, Text, useWindowDimensions, StyleSheet } from 'react-native'
import React from 'react'
import RenderHTML, {
    TBlock,
    CustomBlockRenderer,
    TNodeChildrenRenderer
} from 'react-native-render-html'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../constant/colors';


export const HtmlTag = ({ description, style }) => {
    const width = useWindowDimensions();
    // console.log("des", description['0'])
    const firstChr = description?.charAt(0);

    // const ParagraphRenderer : CustomBlockRenderer = function ParagraphRenderer({
    //     TDefaultRenderer,
    //     tnode,
    //     type,
    //     ...props
    //   }) {
    //     return (
    //       <TDefaultRenderer tnode={tnode} {...props}>
    //         <TNodeChildrenRenderer
    //           tnode={tnode}
    //           parentMarkers={props.markers}
    //           renderChild={({ childTnode, childElement }) =>
    //             type === "block" ? (
    //               childElement
    //             ) : (
    //               <Text numberOfLines={1}>{childElement}</Text>
    //             )
    //           }
    //         />
    //       </TDefaultRenderer>
    //     );
    //   };

    //   const renderHtmlProps = {
    //     source: { html: `${description}`},
    //     renderers: {
    //       p: ParagraphRenderer
    //     }
    //   };
    function fn(text, count) {
        return text.slice(0, count) + (text.length > count ? "..." : "");
    }
    const sorce = {
        html: `${description}`
    };
    const defaultTextProps = {
        numberOfLines: 1,
    };

    return (

        <View>
            {
                firstChr == "<" ?
                    <RenderHTML
                        contentWidth={5000}
                        baseStyle={style}
                        source={sorce}
                    />
                    :
                    <Text style={style}>{description}</Text>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    description: {
        // paddingHorizontal: wp(3),
        // marginTop: hp(1.5),
        color: colors.btnText,
        fontFamily: Fonts.Inter_Regular,
        height: 30
    },

})
