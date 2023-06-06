import { StyleSheet, Text, View } from "react-native";
import React, { useState, useRef } from "react";

import colors from "../constant/colors";
import Video from "react-native-video";
import MediaControls, { PLAYER_STATES } from "react-native-media-controls";

const VideoPlayer = (props) => {
  const { uri, style, from } = props;
  // console.log('uri', uri)
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState("content");

  // Video Handlers

  const onSeek = (seek) => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = (playerState) => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = (data) => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  const onError = () => alert("Oh! ", error);

  const exitFullScreen = () => {
    alert("Exit full screen");
  };

  const enterFullScreen = () => {};

  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == "content") setScreenType("cover");
    else setScreenType("content");
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = (currentTime) => setCurrentTime(currentTime);
  return (
    <>
      <Video
        source={{
          uri: uri
            ? uri
            : "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        // controls={true}
        ref={videoPlayer}
        resizeMode={"contain"}
        // playWhenInactive={false}
        // playInBackground={false}
        //  onFullScreen={isFullScreen}
        // repeat={true}
        volume={10}
        style={[styles.pickerImage, { height: from == "home" ? 250 : "100%" }]}
      />
      <MediaControls
        duration={duration}
        isLoading={isLoading}
        mainColor={colors.theme}
        containerStyle={
          from == "home"
            ? {
                width: "100%",
                height: 250,
                top: 30,
                left: 10,
                backgroundColor: "transparent",
              }
            : null
        }
        // onFullScreen={onFullScreen}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}
        // toolbar={renderToolbar()}
      />
    </>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  pickerImage: {
    width: "100%",
    backgroundColor: colors.cBlack,
    // height: 250
    // borderRadius: 10,
  },
});
