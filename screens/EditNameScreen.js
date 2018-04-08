import React, { Component } from 'react';
import { View, TextInput, Text, StatusBar, UIManager, LayoutAnimation, Platform, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Header } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Axios from 'axios';

import { DropdownAlert, DefaultModal } from '../components';

import { UPDATE_NAME_URL } from '../constants';

import { headerText, ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, formLabelStyle, inputContainer, inputStyle, charCountContainer, charCountText } from '../styles';

class EditNameScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            currentUser: null,
            firstName: '',
            lastName: ''
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { firstName, lastName } = currentUser;
        this.setState({ currentUser, firstName, lastName });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { firstName, lastName } = currentUser;
        this.setState({ currentUser, firstName, lastName });
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

    onSubmitChanges() {
        const { firstName, lastName, currentUser } = this.state;

        if (firstName.replace(' ', '') === '' || lastName.replace(' ', '') === '') {
            this.setState({ error: 'Invalid first name or last name' });
        } else {
            this.setState({ loading: true, error: '' }, () => {
                const { uid, hash } = currentUser;
                Axios.post(UPDATE_NAME_URL, { firstName, lastName, uid, hash })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch(() => this.setState({ loading: false, error: 'Unable to update name, please try again' }));
            });
        }
    }

    onChangeFirstName(text) {
        this.setState({ firstName: text, error: '' });
    }

    onChangeLastName(text) {
        this.setState({ lastName: text, error: '' });
    }

    render() {
        const { currentUser, firstName, lastName, loading, error } = this.state;

        if (!currentUser) {
            return (<View />);
        }

        const { backgroundColor, componentBackgroundColor, borderColor, textColor, statusBar, iconColor } = ColorTheme.current;

        const headerLeft = (
            <Icon
                name='close'
                color={iconColor}
                size={DEFAULT_HEADER_ICON_SIZE}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Edit Name
            </Text>
        );

        const headerRight = (
            <Icon
                name='backup'
                color={iconColor}
                size={DEFAULT_HEADER_ICON_SIZE}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={this.onSubmitChanges}
            />
        );

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps='always'
                >
                    <Text style={formLabelStyle}>
                        First Name *
                    </Text>
                    <View style={[inputContainer, { borderColor, marginTop: 5 }]}>
                        <TextInput
                            autoFocus={true}
                            onChangeText={this.onChangeFirstName}
                            value={firstName}
                            placeholder='Enter new first name here'
                            placeholderTextColor={textColor}
                            maxLength={40}
                            numberOfLines={1}
                            style={[inputStyle, { color: textColor }]}
                        />
                    </View>
                    <View style={charCountContainer}>
                        <Text style={charCountText}>
                            {firstName.length} / 40
                        </Text>
                    </View>
                    <Text style={formLabelStyle}>
                        Last Name *
                    </Text>
                    <View style={[inputContainer, { borderColor, marginTop: 5 }]}>
                        <TextInput
                            onChangeText={this.onChangeLastName}
                            value={lastName}
                            placeholder='Enter new last name here'
                            maxLength={40}
                            numberOfLines={1}
                            style={[inputStyle, { color: textColor }]}
                        />
                    </View>
                    <View style={charCountContainer}>
                        <Text style={charCountText}>
                            {lastName.length} / 40
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating name ...' />
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

export default connect(mapStateToProps, null)(EditNameScreen);