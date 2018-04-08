import React, { Component } from 'react';
import { View, Text, AsyncStorage, TouchableOpacity, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';

import { accountStateChanged } from '../actions';

import { MAIN_SCREEN_NAME } from '../constants';

import { DEFAULT_ACTIVE_OPACITY } from '../styles';

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.onTutorialComplete = this.onTutorialComplete.bind(this);
    }

    async componentWillMount() {
        // firebase.auth().signOut();
        firebase.auth().onAuthStateChanged((user) => this.props.accountStateChanged(user));

        let token = await AsyncStorage.getItem('has_opened');
        if (token) {
            //this.props.navigation.navigate('home');
        }
    }

    onTutorialComplete() {
        AsyncStorage.setItem('has_opened', 'true');
        this.props.navigation.navigate(MAIN_SCREEN_NAME);
    }

    render() {
        const { currentUser } = this.props;
        const name = currentUser ? currentUser.firstName : 'Dear User';
        const { container, userNameText, skipButton, skipButtonText } = styles;

        return (
            <View style={{ flex: 1, backgroundColor: '#B5DBE8' }}>
                <StatusBar barStyle='dark-content' />
                <View style={container}>
                    <Text style={userNameText}>
                        Welcome, {name}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity
                        style={skipButton}
                        onPress={this.onTutorialComplete}
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    >
                        <Text style={skipButtonText}>
                            Main page
                        </Text>
                        <Icon
                            name='keyboard-arrow-right'
                            color='black'
                            backgroundColor='rgba(0, 0, 0, 0)'
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userNameText: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    skipButton: {
        flexDirection: 'row',
        right: 10,
        bottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    skipButtonText: {
        fontSize: 14,
        color: 'black',
        fontStyle: 'italic',
        fontWeight: 'bold'
    }
};

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, { accountStateChanged })(WelcomeScreen);