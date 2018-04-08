import React, { Component } from 'react';
import { View, Text, LayoutAnimation, UIManager, Platform, Modal, StatusBar, ScrollView, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Header, Icon, Button } from 'react-native-elements';

import { DatePicker, DropdownAlert, DefaultModal } from '../components';

import { UPDATE_BIRTHDAY_URL } from '../constants';

import { headerText, ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, formLabelStyle } from '../styles';

import { formatBirthday } from '../actions';

class EditBirthdayScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentUser: null,
            birthday: null,
            error: ''
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onRemoveBirthday = this.onRemoveBirthday.bind(this);
        this.onChangeBirthday = this.onChangeBirthday.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { birthday } = currentUser;
        this.setState({ currentUser, birthday: birthday ? new Date(birthday) : new Date() });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { birthday } = currentUser;
        this.setState({ currentUser, birthday: birthday ? new Date(birthday) : new Date() });
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
        const { currentUser, birthday } = this.state;
        if (!birthday || birthday === '') {
            this.setState({ error: 'Please select your birthday' });
        } else {
            const { uid, hash } = currentUser;
            this.setState({ loading: true, error: '' }, () => {
                Axios.post(UPDATE_BIRTHDAY_URL, { uid, hash, birthday })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch((error) => this.setState({ loading: false, error: 'Unable to update birthday, please try again' }));
            });
        }
    }

    onRemoveBirthday() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Do you want to delete your birthday?',
            options: [
                'Remove Birthday',
                'Cancel',
            ],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                const { uid, hash } = this.state.currentUser;
                this.setState({ loading: true, error: '' }, () => {
                    Axios.post(UPDATE_BIRTHDAY_URL, { uid, hash, birthday: null })
                        .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                        .catch(() => this.setState({ loading: false, error: 'Unable to remove birthday, please try again' }));
                });
            }
        });
    }

    onChangeBirthday({ selectedDate }) {
        this.setState({ birthday: selectedDate, error: '' });
    }

    render() {
        const { currentUser, birthday, loading, error } = this.state;
        const { statusBar, textColor, borderColor, backgroundColor, componentBackgroundColor, iconColor } = ColorTheme.current;
        const { previewText, pickerStyle } = styles;

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
                Edit Birthday
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
                    onPress={this.onRemoveBirthday}
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
                <ScrollView style={{ flex: 1 }}>
                    <Text style={formLabelStyle}>
                        Select Your Birthday
                    </Text>
                    <Text style={previewText}>
                        {formatBirthday(birthday)}
                    </Text>
                    <DatePicker
                        date={birthday}
                        onChangeDate={this.onChangeBirthday}
                        container={pickerStyle}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </ScrollView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating birthday ...' />
                </Modal>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

const styles = {
    previewText: {
        color: '#4099FF',
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 10,
        paddingHorizontal: 10
    },
    pickerStyle: {
        marginHorizontal: 10,
        marginTop: 5,
        marginBottom: 20
    }
};

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(EditBirthdayScreen);