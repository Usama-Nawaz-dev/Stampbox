import messaging from '@react-native-firebase/messaging';
import Helper from '../Helper'

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        // getFcmToken();
    }
}

export const getFcmToken = async () => {
    let fcmToken = await Helper.getData("fcmToken");
    console.log("The old token ->", fcmToken)
    if (!fcmToken) {
        try {
            const fcmToken = await messaging().getToken();
            await Helper.storeData("fcmToken", fcmToken)
            console.log('The new token ->', fcmToken)
        } catch (err) {
            console.log(err, "Error rasied in fcmToken");
            alert(err.message)
        }
    }
}

export const notificationListener = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        // messaging()
        //     .onMessage(async remoteMessage => {
        //         console.log('Recieved in foreground:', remoteMessage)
        //         alert(remoteMessage?.notification?.body)
        //     })
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                }
            });
    });
}