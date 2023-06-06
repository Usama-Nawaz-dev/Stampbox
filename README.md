# StampBox iOS APP

## Building

### Prerequisites

- Xcode installation with command line tools.
- android studio install for the sdk, ndk, adb, etc...
- nodejs (use https://nodejs.org/en/ or use command line `brew install node`)
- yarn

### Building and Running

#### Installation

```
yarn install
```

#### Starting metro

```
npx react-native start
```

#### Starting for android

launches an emulator or sends app to an adb connected phone

```
npx react-native run-android
```

#### Before Running on iOS, Install Pods

change directory to $HOME/{PATH_TO_SOURCE}/ios

```
pods install
```

#### Pod Installation Prereqs:

For some reason pods throws an error for React Core stating the following:

Error: "[!] CocoaPods could not find compatible versions for pod "React/Core":"

Solution:

```
grep -rl "s.dependency 'React/Core'" node_modules/ | xargs sed -i '' 's=React/Core=React-Core=g'
```

#### Starting for iOS

launches an iOS Simulator or sends app to an connected iPhone

```
npx react-native run-ios
```

## Purpose

The purpose of this project is to create a react native version for our product named "Stampbox". It's react-native version is developed for cross-platform but currently it supports only iOS devices.

## Deployment

To deploy or publish this project on iPhone run the project on Xcode. Use the Xcode -> Product -> Archive to generate archieve file and use Orgainzer to Upload to AppStore or export IPA file.

## License

[Copyrights © 2022 stampbox.com, All Rights Reserved ](https://stampbox.com/privacy-policy/)
