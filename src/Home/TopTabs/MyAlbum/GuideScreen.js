// Example to Create Step by Step Walkthrough in any React Native App
// https://aboutreact.com/step-by-step-app-introduction-in-react-native/

// import React in our code
import React, { useState, useEffect } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";

const ScreenGuide = (props) => {
  const dispatch = useDispatch();
  const [secondStepActive, setSecondStepActive] = useState(true);

  useEffect(() => {
    //setting a function to handle the step change event
    props.copilotEvents.on("stepChange", handleStepChange);
    //To start the step by step Walk through
    props.start();
    getAlbums()
  }, []);

  const handleStepChange = (step) => {
    //Handler, in case we want to handle the step change
    console.log(`Current step is: ${step.name}`);
  };

  //Making a WalkthroughableText
  const WalkthroughableText = walkthroughable(Text);
  //Making a WalkthroughableImage
  const WalkthroughableImage = walkthroughable(Image);

  const getAlbums = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Album&user_id=${11}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/*Step 1 to show the heading*/}
        <CopilotStep
          text="This is the heading with some style"
          order={1}
          name="firstUniqueKey"
        >
          <WalkthroughableText style={styles.title}>
            Example of App Introduction Tour in React Native
          </WalkthroughableText>
        </CopilotStep>
        {/*Step 3 to show the Image*/}
        <CopilotStep text="This is a image" order={3} name="thirdUniqueKey">
          <WalkthroughableImage
            source={{
              uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/react_logo.png",
            }}
            style={styles.profilePhoto}
          />
        </CopilotStep>
        {/*Step 2 to show the normal text*/}
        <View style={styles.activeSwitchContainer}>
          <CopilotStep
            active={secondStepActive}
            text="This is simple text without style"
            order={2}
            name="SecondUniqueKey"
          >
            <WalkthroughableText>
              Default text without style which can be skiped after disabling the
              switch
            </WalkthroughableText>
          </CopilotStep>
          <View style={{ flexGrow: 1 }} />
          <Switch
            onValueChange={(secondStepActive) =>
              setSecondStepActive(secondStepActive)
            }
            value={secondStepActive}
          />
        </View>
        {/*Button to start the walkthrough*/}
        <View style={styles.middleView}>
          <TouchableOpacity style={styles.button} onPress={() => props.start()}>
            <Text style={styles.buttonText}>START APP INTRODUCTION TOUR</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(ScreenGuide);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  middleView: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2980b9",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  activeSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 40,
  },
});
