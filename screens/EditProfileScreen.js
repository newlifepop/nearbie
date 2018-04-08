import React, { Component } from 'react';
import {
    View, Text, Image, ScrollView, UIManager, Platform,
    LayoutAnimation, StatusBar, Alert, ActionSheetIOS
} from 'react-native';
import { Icon, Header, ListItem } from 'react-native-elements';
import Flag from 'react-native-flags';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { EmptySideHeader } from '../components';

import { ColorTheme, headerText, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, drawerIcon } from '../styles';

import { EDIT_NAME_SCREEN_NAME, LOCATION_SCREEN_NAME, PICK_LOCATION_OPERATION, EDIT_GENDER_SCREEN_NAME, EDIT_BIRTHDAY_SCREEN_NAME, WORKING_JOB_TYPE, EDIT_JOB_SCREEN_NAME, EDIT_NATIONALITY_SCREEN_NAME, STUDENT_JOB_TYPE } from '../constants';

import { renderGenderIcon, formatBirthday, updateLocation } from '../actions';

const editBirthday = (<Image source={require('../assets/pictures/profile/birthday.png')} style={drawerIcon} />);
const editEmail = (<Image source={require('../assets/pictures/profile/email.png')} style={drawerIcon} />);
const editFlag = (<Image source={require('../assets/pictures/profile/flag.png')} style={drawerIcon} />);
const editGender = (<Image source={require('../assets/pictures/profile/gender.png')} style={drawerIcon} />);
const editLocation = (<Image source={require('../assets/pictures/profile/location.png')} style={drawerIcon} />);
const editName = (<Image source={require('../assets/pictures/profile/name.png')} style={drawerIcon} />);
const editSchool = (<Image source={require('../assets/pictures/profile/school.png')} style={drawerIcon} />);
const editWork = (<Image source={require('../assets/pictures/profile/work.png')} style={drawerIcon} />);

class EditProfileScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };

        this.onPressEditLocation = this.onPressEditLocation.bind(this);
        this.onEditLocation = this.onEditLocation.bind(this);
        this.onPickLocationComplete = this.onPickLocationComplete.bind(this);
        this.onSubmitChanges = this.onSubmitChanges.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        this.setState({ currentUser: this.props.currentUser });
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentUser: nextProps.currentUser });
    }

    componentWillUnmount() {
        ColorTheme.unsubscribeComponent(this);
    }

    onPressEditLocation() {
        if (!this.state.currentUser.location) {
            this.onEditLocation();
            return;
        }

        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                'Add/Update Location',
                'Remove Location',
                'Cancel'
            ],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.onEditLocation();
            } else if (buttonIndex === 1) {
                this.onSubmitChanges(null);
            }
        });
    }

    onEditLocation() {
        const { location } = this.state.currentUser;
        var latitude = null;
        var longitude = null;
        if (location) {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
        }

        const pickLocationAction = NavigationActions.navigate({
            routeName: LOCATION_SCREEN_NAME,
            params: {
                actionType: PICK_LOCATION_OPERATION, latitude,
                longitude, confirmLocationButtonTitle: 'Confirm Location',
                onComplete: this.onPickLocationComplete
            }
        });

        this.props.navigation.dispatch(pickLocationAction);
    }

    onPickLocationComplete(location) {
        Alert.alert(
            'Confirm Location',
            `${location.formattedAddress}`,
            [
                { text: 'No', onPress: this.onEditLocation },
                { text: 'Yes', onPress: () => this.onSubmitChanges(location) }
            ],
            { cancelable: false }
        );
    }

    onSubmitChanges(location) {
        const { uid, hash } = this.state.currentUser;
        updateLocation(uid, hash, location);
    }

    render() {
        const { currentUser } = this.state;

        if (!currentUser) {
            return (<View />);
        }

        const { menuItemTitleStyle } = styles;
        const { navigation } = this.props;
        const { goBack, navigate } = navigation;
        const { backgroundColor, componentBackgroundColor, borderColor, textColor, statusBar, iconColor } = ColorTheme.current;
        const { firstName, lastName, gender, email, birthday, job, nationality, location } = currentUser;

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Edit Profile
            </Text>
        );

        const headerRight = (
            <Icon
                name='done'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={iconColor}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => goBack()}
            />
        );

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                    leftComponent={EmptySideHeader}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <ScrollView style={{ flex: 1 }}>
                    <Text style={{ margin: 10, fontSize: 18, color: textColor, fontWeight: 'bold' }}>
                        Basic Information (Required)
                    </Text>
                    <ListItem
                        containerStyle={{
                            borderTopWidth: 1, borderBottomWidth: 1,
                            borderTopColor: borderColor,
                            borderBottomColor: borderColor,
                            backgroundColor: componentBackgroundColor
                        }}
                        key='email'
                        leftIcon={editEmail}
                        title={email}
                        disabled={true}
                        titleNumberOfLines={1}
                        titleStyle={menuItemTitleStyle}
                    />
                    <ListItem
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        leftIcon={editName}
                        title={`${firstName} ${lastName}`}
                        titleNumberOfLines={1}
                        titleStyle={menuItemTitleStyle}
                        underlayColor={componentBackgroundColor}
                        onPress={() => navigate(EDIT_NAME_SCREEN_NAME)}
                    />
                    <ListItem
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        leftIcon={editGender}
                        title={
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Text style={menuItemTitleStyle}>
                                    {gender}
                                </Text>
                                <Image
                                    source={renderGenderIcon(gender)}
                                    style={{ marginLeft: 8, width: 20, height: 20 }}
                                />
                            </View>
                        }
                        titleNumberOfLines={1}
                        titleStyle={menuItemTitleStyle}
                        underlayColor={componentBackgroundColor}
                        onPress={() => navigate(EDIT_GENDER_SCREEN_NAME)}
                    />
                    <Text style={{ margin: 10, fontSize: 18, color: textColor, fontWeight: 'bold' }}>
                        Detailed Information (Optional)
                    </Text>
                    <ListItem
                        containerStyle={{ backgroundColor: componentBackgroundColor, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: borderColor, borderBottomColor: borderColor }}
                        leftIcon={editBirthday}
                        title={birthday ? formatBirthday(new Date(birthday)) : 'Add Birthday'}
                        titleNumberOfLines={1}
                        titleStyle={birthday ? menuItemTitleStyle : [menuItemTitleStyle, { color: 'gray' }]}
                        underlayColor={componentBackgroundColor}
                        onPress={() => navigate(EDIT_BIRTHDAY_SCREEN_NAME)}
                    />
                    <ListItem
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        leftIcon={job && job.type === STUDENT_JOB_TYPE ? editSchool : editWork}
                        title={job ? job.title : 'Add Job'}
                        titleNumberOfLines={1}
                        underlayColor={componentBackgroundColor}
                        titleStyle={job ? menuItemTitleStyle : [menuItemTitleStyle, { color: 'gray' }]}
                        onPress={() => navigate(EDIT_JOB_SCREEN_NAME)}
                    />
                    <ListItem
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        leftIcon={editLocation}
                        title={location ? location.formattedAddress : 'Add Address'}
                        titleNumberOfLines={1}
                        underlayColor={componentBackgroundColor}
                        titleStyle={location ? menuItemTitleStyle : [menuItemTitleStyle, { color: 'gray' }]}
                        onPress={this.onPressEditLocation}
                    />
                    <ListItem
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        key='nationality'
                        leftIcon={editFlag}
                        title={nationality ? (
                            <Flag size={32} code={nationality} type='flat' />
                        ) : 'Add Nationality'}
                        titleNumberOfLines={1}
                        underlayColor={componentBackgroundColor}
                        titleStyle={nationality ? menuItemTitleStyle : [menuItemTitleStyle, { color: 'gray' }]}
                        onPress={() => navigate(EDIT_NATIONALITY_SCREEN_NAME)}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    menuItemTitleStyle: {
        fontSize: 18,
        color: '#4099FF'
    }
};

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(EditProfileScreen);