import React, { Component } from 'react';
import { View, TextInput, Text, StatusBar, UIManager, LayoutAnimation, Platform, Modal, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Header } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Axios from 'axios';

import { DropdownAlert, DefaultModal } from '../components';

import { UPDATE_BIO_URL, MAX_BIO_LENGTH, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

import { ColorTheme, headerText, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, charCountContainer, charCountText } from '../styles';

class EditBioScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            currentUser: null,
            bio: ''
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.onRemoveBio = this.onRemoveBio.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { bio } = currentUser;
        this.setState({ currentUser, bio: bio ? bio : '' });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { bio } = currentUser;
        this.setState({ currentUser, bio: bio ? bio : '' });
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

    onChangeBio(text) {
        this.setState({ bio: text, error: '' });
    }

    onRemoveBio() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Do you want to delete your bio?',
            options: [
                'Remove Bio',
                'Cancel'
            ],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.setState({ loading: true, error: '' }, () => {
                    const { uid, hash } = this.state.currentUser;
                    Axios.post(UPDATE_BIO_URL, { uid, hash, bio: null })
                        .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                        .catch((error) => this.setState({ loading: false, error: 'Unable to remove bio, please try again' }));
                });
            }
        });
    }

    onSubmitChanges() {
        const { currentUser, bio } = this.state;

        if (bio.replace(' ', '') === '') {
            this.setState({ error: 'Please enter a valid bio' });
        } else {
            this.setState({ loading: true, error: '' }, () => {
                const { uid, hash } = currentUser;
                Axios.post(UPDATE_BIO_URL, { uid, hash, bio })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch((error) => this.setState({ loading: false, error: 'Unable to update bio, please try again' }));
            });
        }
    }

    render() {
        const { currentUser, loading, bio, error } = this.state;
        const { backgroundColor, borderColor, textColor, statusBar, componentBackgroundColor, iconColor } = ColorTheme.current;
        const { inputContainer, inputStyle } = styles;

        if (!currentUser) {
            return (<View />);
        }

        const headerLeft = (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name='close'
                    size={DEFAULT_HEADER_ICON_SIZE}
                    color={iconColor}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={() => this.props.navigation.goBack()}
                />
                <View style={{ width: DEFAULT_HEADER_ICON_SIZE + 20 }} />
            </View>
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Edit Bio
            </Text>
        );

        const headerRight = (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name='delete-forever'
                    size={DEFAULT_HEADER_ICON_SIZE}
                    color='#F44336'
                    containerStyle={{ marginRight: 20 }}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={this.onRemoveBio}
                />
                <Icon
                    name='backup'
                    color={iconColor}
                    size={DEFAULT_HEADER_ICON_SIZE}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={this.onSubmitChanges}
                />
            </View>
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
                    <View style={[inputContainer, { borderBottomColor: borderColor }]}>
                        <TextInput
                            style={[inputStyle, { color: textColor }]}
                            placeholder='Say something ...'
                            placeholderTextColor={textColor}
                            onChangeText={this.onChangeBio}
                            multiline={true}
                            maxLength={MAX_BIO_LENGTH}
                            defaultValue={bio}
                        />
                        <View style={[charCountContainer, { marginBottom: 5 }]}>
                            <Text style={charCountText}>
                                {bio.length} / {MAX_BIO_LENGTH}
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating bio ...' />
                </Modal>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

const styles = {
    inputContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 4,
        flexDirection: 'column',
        borderBottomWidth: 1
    },
    inputStyle: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'black',
        flex: 1
    }
};

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(EditBioScreen);