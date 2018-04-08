import React, { Component } from 'react';
import {
    View, KeyboardAvoidingView, Text, TouchableOpacity, StatusBar,
    LayoutAnimation, Platform, UIManager, TextInput, Modal
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, ButtonGroup, Header } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import Axios from 'axios';
import firebase from 'firebase';

import { EmptySideHeader, DefaultModal, DropdownAlert } from '../components';

import { GENDERS, EMAIL_FORMAT, MALE_GENDER, REGISTER_URL } from '../constants';

import { ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_HEADER_ICON_COLOR, DEFAULT_ICON_UNDERLAY_COLOR, headerText, formLabelStyle, formInputStyle, charCountContainer, charCountText, DEFAULT_BUTTON_UNDERLAY_COLOR, buttonGroupContainer, registerButtonContainer, DEFAULT_ACTIVE_OPACITY, registerButton, registerButtonText } from '../styles';

class RegisterScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false, error: '',
            firstName: 'Changyu', lastName: 'Wu',
            email: 'new3711@gmail.com',
            password: '1newlifepop',
            conPassword: '1newlifepop',
            gender: MALE_GENDER
        };

        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onConPasswordChanged = this.onConPasswordChanged.bind(this);
        this.onFirstNameChanged = this.onFirstNameChanged.bind(this);
        this.onLastNameChanged = this.onLastNameChanged.bind(this);
        this.onGenderChanged = this.onGenderChanged.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser) {
            this.setState({ loading: false }, () => this.props.navigation.goBack());
        }
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        ColorTheme.unsubscribeComponent(this);
    }

    onEmailChanged(text) {
        this.setState({ email: text, error: '' });
    }

    onPasswordChanged(text) {
        this.setState({ password: text, error: '' });
    }

    onConPasswordChanged(text) {
        this.setState({ conPassword: text, error: '' });
    }

    onFirstNameChanged(text) {
        this.setState({ firstName: text, error: '' });
    }

    onLastNameChanged(text) {
        this.setState({ lastName: text, error: '' });
    }

    onGenderChanged(selectedIndex) {
        this.setState({ gender: GENDERS[selectedIndex], error: '' });
    }

    onRegister() {
        const { email, password, conPassword, firstName, lastName, gender } = this.state;

        if (!EMAIL_FORMAT.test(email)) {
            this.setState({ error: `Invalid email address ${email}` });
        } else if (password !== conPassword) {
            this.setState({ error: 'Passwords don\'t match' });
        } else if (firstName.replace(' ', '') === '' || lastName.replace(' ', '') === '') {
            this.setState({ error: 'Invalid first name or last name' });
        } else if (!_.includes(GENDERS, gender)) {
            this.setState({ error: 'Please select your gender' });
        } else {
            this.setState({ loading: true, error: '' });
            Axios.post(REGISTER_URL, { email, password, firstName, lastName, gender })
                .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
                .catch(() => this.setState({ loading: false, error: 'Unable to register, this email may have been associated with another account' }));
        }
    }

    render() {
        const { loading, firstName, lastName, error,
            email, password, conPassword, gender } = this.state;
        const { textColor, componentBackgroundColor, borderColor, statusBar } = ColorTheme.current;

        const headerLeft = (
            <Icon
                name='close'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={DEFAULT_HEADER_ICON_COLOR}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Sign Up
            </Text>
        );

        return (
            <View style={{ flex: 1, backgroundColor: componentBackgroundColor }}>
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={EmptySideHeader}
                />
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps='always'
                >
                    <Text style={formLabelStyle}>
                        Email Address *
                    </Text>
                    <TextInput
                        keyboardType='email-address'
                        placeholder='(e.g. nearbie@gmail.com)'
                        placeholderTextColor={textColor}
                        value={email}
                        autoCapitalize='none'
                        onChangeText={this.onEmailChanged}
                        autoCorrect={false}
                        editable={!loading}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                    />
                    <Text style={formLabelStyle}>
                        Password *
                    </Text>
                    <TextInput
                        secureTextEntry={true}
                        value={password}
                        autoCapitalize='none'
                        onChangeText={this.onPasswordChanged}
                        autoCorrect={false}
                        editable={!loading}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                    />
                    <Text style={formLabelStyle}>
                        Confirm Password *
                    </Text>
                    <TextInput
                        secureTextEntry={true}
                        value={conPassword}
                        autoCapitalize='none'
                        onChangeText={this.onConPasswordChanged}
                        autoCorrect={false}
                        editable={!loading}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                    />
                    <Text style={formLabelStyle}>
                        First Name *
                    </Text>
                    <TextInput
                        placeholder='(e.g. Peter)'
                        placeholderTextColor={textColor}
                        value={firstName}
                        onChangeText={this.onFirstNameChanged}
                        editable={!loading}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                        maxLength={40}
                    />
                    <View style={charCountContainer}>
                        <Text style={charCountText}>
                            {firstName.length} / 40
                        </Text>
                    </View>
                    <Text style={formLabelStyle}>
                        Last Name *
                    </Text>
                    <TextInput
                        placeholder='(e.g. Griffin)'
                        placeholderTextColor={textColor}
                        value={lastName}
                        onChangeText={this.onLastNameChanged}
                        editable={!loading}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                        maxLength={40}
                    />
                    <View style={charCountContainer}>
                        <Text style={charCountText}>
                            {lastName.length} / 40
                        </Text>
                    </View>
                    <Text style={formLabelStyle}>
                        Gender *
                    </Text>
                    <ButtonGroup
                        textStyle={{ color: textColor, fontSize: 16 }}
                        onPress={this.onGenderChanged}
                        selectedIndex={GENDERS.indexOf(gender)}
                        buttons={GENDERS}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        innerBorderStyle={{ width: 1, color: borderColor }}
                        containerStyle={[buttonGroupContainer, { marginBottom: 20, borderColor }]}
                        selectedTextStyle={{ color: 'white' }}
                        selectedButtonStyle={{ backgroundColor: '#4099FF' }}
                    />
                </KeyboardAwareScrollView>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={registerButtonContainer}
                >
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={registerButton}
                        onPress={this.onRegister}
                    >
                        <Text style={registerButtonText}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Signing up ...' />
                </Modal>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(RegisterScreen);