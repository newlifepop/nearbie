import React, { Component } from 'react';
import {
    View, KeyboardAvoidingView, Text, TouchableOpacity, StatusBar,
    LayoutAnimation, Platform, UIManager, TextInput, Modal, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Header } from 'react-native-elements';
import firebase from 'firebase';

import { EmptySideHeader, DefaultModal, DropdownAlert } from '../components';

import {
    ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_HEADER_ICON_COLOR, DEFAULT_ICON_UNDERLAY_COLOR, headerText, formLabelStyle, formInputStyle, loginMenuContainer, forgotPasswordButton, DEFAULT_ACTIVE_OPACITY, forgotPasswordText, loginButtonContainer, loginButtonText,
} from '../styles';

import { EMAIL_FORMAT } from '../constants';

class LoginScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false, error: '',
            email: 'new3711@gmail.com',
            password: '1newlifepop'
        };

        this.onLogin = this.onLogin.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
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

    onLogin() {
        const { email, password } = this.state;

        if (!EMAIL_FORMAT.test(email)) {
            this.setState({ error: `Invalid email address: ${email}` });
        } else if (password.length === 0) {
            this.setState({ error: 'Please enter your password' });
        } else {
            this.setState({ loading: true, error: '' }, () => firebase
                .auth().signInWithEmailAndPassword(email, password)
                .catch((error) => this.setState({ loading: false, error: error.message })));
        }
    }

    onForgotPassword() {

    }

    onEmailChanged(text) {
        this.setState({ email: text, error: '' });
    }

    onPasswordChanged(text) {
        this.setState({ password: text, error: '' });
    }

    render() {
        const { textColor, borderColor, statusBar, componentBackgroundColor } = ColorTheme.current;
        const { error, email, password, loading } = this.state;

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
                Sign In
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
                <ScrollView
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
                        onChangeText={this.onEmailChanged}
                        value={email}
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                    />
                    <Text style={formLabelStyle}>
                        Password *
                    </Text>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={this.onPasswordChanged}
                        value={password}
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[formInputStyle, { color: textColor, borderBottomColor: borderColor }]}
                    />
                </ScrollView>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={[loginMenuContainer, { borderTopColor: borderColor }]}
                >
                    <TouchableOpacity
                        style={forgotPasswordButton}
                        onPress={this.onForgotPassword}
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    >
                        <Text style={forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <View style={loginButtonContainer}>
                        <TouchableOpacity
                            onPress={this.onLogin}
                            activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        >
                            <Text style={loginButtonText}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Signing in ...' />
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

export default connect(mapStateToProps, null)(LoginScreen);