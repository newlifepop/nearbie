import React, { Component } from 'react';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { TabNavigator, StackNavigator } from 'react-navigation';
import RNFS from 'react-native-fs';

import store from './store';

import WelcomeScreen from './screens/WelcomeScreen';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TestScreen from './screens/TestScreen';
import LocationScreen from './screens/LocationScreen';
import CameraRollScreen from './screens/CameraRollScreen';
import CameraScreen from './screens/CameraScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditNameScreen from './screens/EditNameScreen';
import EditGenderScreen from './screens/EditGenderScreen';
import EditBirthdayScreen from './screens/EditBirthdayScreen';
import EditJobScreen from './screens/EditJobScreen';
import EditNationalityScreen from './screens/EditNationalityScreen';
import PostScreen from './screens/PostScreen';
import EditBioScreen from './screens/EditBioScreen';

function fadeInTransition(props) {
    const { position, scene } = props;
    const { index } = scene;

    const translateX = 0;
    const translateY = 0;

    const opacity = position.interpolate({
        inputRange: [index - 0.7, index, index + 0.7],
        outputRange: [0.3, 1, 0.3]
    });

    return {
        opacity,
        transform: [{ translateX }, { translateY }]
    };
}

const MainTabNavigator = TabNavigator({
    welcome: { screen: WelcomeScreen },
    main: { screen: MainScreen }
}, { lazy: true, navigationOptions: { tabBarVisible: false } });

const MainStackNavigator = StackNavigator({
    tab: { screen: MainTabNavigator },
}, { headerMode: 'none' });

const MainModalNavigator = StackNavigator({
    stack: { screen: MainStackNavigator },
    login: { screen: LoginScreen },
    register: { screen: RegisterScreen },
    location: { screen: LocationScreen },
    cameraRoll: { screen: CameraRollScreen },
    camera: { screen: CameraScreen },
    editProfile: { screen: EditProfileScreen },
    editName: { screen: EditNameScreen },
    editGender: { screen: EditGenderScreen },
    editBirthday: { screen: EditBirthdayScreen },
    editJob: { screen: EditJobScreen },
    editNationality: { screen: EditNationalityScreen },
    editBio: { screen: EditBioScreen },
    post: { screen: PostScreen },
    test: { screen: TestScreen },
}, { headerMode: 'none', mode: 'modal' });

const MainNavigator = StackNavigator({
    modal: { screen: MainModalNavigator }
}, {
        headerMode: 'none',
        transitionConfig: () => ({
            screenInterpolator: (props) => fadeInTransition(props)
        })
    }
);

class App extends Component {
    async componentWillMount() {
        const config = {
            apiKey: 'AIzaSyBTXrVm8r6mAmh8mwG4_bu8EE6beQ7bCB4',
            authDomain: 'nearbie-182205.firebaseapp.com',
            databaseURL: 'https://nearbie-182205.firebaseio.com',
            projectId: 'nearbie-182205',
            storageBucket: 'nearbie-182205.appspot.com',
            messagingSenderId: '484584154034'
        };
        await firebase.initializeApp(config);

        console.ignoredYellowBox = [
            'Remote debugger',
            'Warning: Overriding previous',
            'Warning: GooglePlacesAutocomplete',
            'FaceDetector not integrated',
            'Setting focusDepth',
            'FIREBASE WARNING',
            'Warning: Can only update a mounted'
        ];

        RNFS.readdir(RNFS.TemporaryDirectoryPath)
            .then((files) => files.forEach((file) => RNFS.unlink(`${RNFS.TemporaryDirectoryPath}${file}`)));
    }

    render() {
        return (
            <Provider store={store}>
                <MainNavigator />
            </Provider>
        );
    }
}

export default App;