import React, { Component } from 'react';
import { View, Text, StatusBar, Platform, UIManager, LayoutAnimation, ScrollView, TouchableWithoutFeedback, Switch, Image as LocalImage, ActionSheetIOS } from 'react-native';
import { Icon, ListItem, Button, Header } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import RemoteImage from 'react-native-fast-image';
import Drawer from 'react-native-drawer';

import { ColorTheme, headerText, introContainer, introText, drawerMenuTitle, DEFAULT_BUTTON_UNDERLAY_COLOR, drawerHeaderContainer, drawerProfilePicture, drawerName, drawerEmail, DEFAULT_TRANSPARENT_BACKGROUND_COLOR, parallaxHeaderIconContainer, DEFAULT_DRAWER_ICON_TYPE, drawerIcon, DEFAULT_HEADER_ICON_SIZE } from '../styles';

import { CAMERA_ROLL_SCREEN_NAME, SCREEN_WIDTH, REGISTER_SCREEN_NAME, LOGIN_SCREEN_NAME, EDIT_PROFILE_SCREEN_NAME, SCREEN_HEIGHT, DARK_THEME, POST_SCREEN_NAME, ASSET_TYPE_PHOTOS, CAMERA_SCREEN_NAME, EDIT_BIO_SCREEN_NAME } from '../constants';

import { Profile, Seperator } from '../components';

import { formatName, renderGenderIcon, updateProfilePicture, updateWallpaper } from '../actions';

const album = (<LocalImage source={require('../assets/pictures/drawer/album.png')} style={drawerIcon} />);
const allPosts = (<LocalImage source={require('../assets/pictures/drawer/all_posts.png')} style={drawerIcon} />);
const biography = (<LocalImage source={require('../assets/pictures/drawer/biography.png')} style={drawerIcon} />);
const changeProfilePicture = (<LocalImage source={require('../assets/pictures/drawer/change_profile_picture.png')} style={drawerIcon} />);
const changeWallpaper = (<LocalImage source={require('../assets/pictures/drawer/change_wallpaper.png')} style={drawerIcon} />);
const createGroup = (<LocalImage source={require('../assets/pictures/drawer/create_group.png')} style={drawerIcon} />);
const darkTheme = (<LocalImage source={require('../assets/pictures/drawer/dark_theme.png')} style={drawerIcon} />);
const deletedPosts = (<LocalImage source={require('../assets/pictures/drawer/deleted_posts.png')} style={drawerIcon} />);
const discover = (<LocalImage source={require('../assets/pictures/drawer/discover.png')} style={drawerIcon} />);
const editProfile = (<LocalImage source={require('../assets/pictures/drawer/edit_profile.png')} style={drawerIcon} />);
const friends = (<LocalImage source={require('../assets/pictures/drawer/friends.png')} style={drawerIcon} />);
const help = (<LocalImage source={require('../assets/pictures/drawer/help.png')} style={drawerIcon} />);
const joinedGroups = (<LocalImage source={require('../assets/pictures/drawer/joined_groups.png')} style={drawerIcon} />);
const likedPosts = (<LocalImage source={require('../assets/pictures/drawer/liked_posts.png')} style={drawerIcon} />);
const conversation = (<LocalImage source={require('../assets/pictures/drawer/message.png')} style={drawerIcon} />);
const moments = (<LocalImage source={require('../assets/pictures/drawer/moments.png')} style={drawerIcon} />);
const peopleNearby = (<LocalImage source={require('../assets/pictures/drawer/people_nearby.png')} style={drawerIcon} />);
const QRCode = (<LocalImage source={require('../assets/pictures/drawer/qr_code.png')} style={drawerIcon} />);
const settings = (<LocalImage source={require('../assets/pictures/drawer/settings.png')} style={drawerIcon} />);
const share = (<LocalImage source={require('../assets/pictures/drawer/share.png')} style={drawerIcon} />);

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };

        this.onChangeProfilePicture = this.onChangeProfilePicture.bind(this);
        this.takeProfilePicture = this.takeProfilePicture.bind(this);
        this.pickProfilePicture = this.pickProfilePicture.bind(this);
        this.onChangeWallpaper = this.onChangeWallpaper.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        this.setState({ currentUser: this.props.currentUser });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentUser: nextProps.currentUser });
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

    onChangeProfilePicture() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                'Choose from Photos',
                'Open Camera',
                'Cancel'
            ],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.pickProfilePicture();
            } else if (buttonIndex === 1) {
                this.takeProfilePicture();
            }
        });
    }

    pickProfilePicture() {
        const { uid, hash } = this.state.currentUser;
        const pickProfilePictureAction = NavigationActions.navigate({
            routeName: CAMERA_ROLL_SCREEN_NAME,
            params: {
                maxPhotos: 1, assetType: ASSET_TYPE_PHOTOS,
                onComplete: (images) => updateProfilePicture(uid, hash, images[0].path)
            }
        });
        this.props.navigation.dispatch(pickProfilePictureAction);
    }

    takeProfilePicture() {
        const { uid, hash } = this.state.currentUser;
        const takeProfilePictureAction = NavigationActions.navigate({
            routeName: CAMERA_SCREEN_NAME,
            params: {
                assetType: ASSET_TYPE_PHOTOS,
                onComplete: (images) => updateProfilePicture(uid, hash, images[0].path)
            }
        });
        this.props.navigation.dispatch(takeProfilePictureAction);
    }

    onChangeWallpaper() {
        const { uid, hash } = this.state.currentUser;
        const pickWallpaperAction = NavigationActions.navigate({
            routeName: CAMERA_ROLL_SCREEN_NAME,
            params: {
                maxPhotos: 1, assetType: ASSET_TYPE_PHOTOS,
                onComplete: (images) => updateWallpaper(uid, hash, images[0].path)
            }
        });
        this.props.navigation.dispatch(pickWallpaperAction);
    }

    render() {
        const { currentUser } = this.state;
        const { backgroundColor, componentBackgroundColor, statusBar, textColor, borderColor, theme } = ColorTheme.current;
        const { navigation } = this.props;
        const { navigate } = navigation;

        if (!currentUser) {
            return (
                <View style={[introContainer, { backgroundColor: componentBackgroundColor }]}>
                    <StatusBar barStyle={statusBar} />
                    <Text style={[introText, { color: textColor }]}>
                        Let people nearby{'\n'}
                        know what you are up to
                    </Text>
                    <Button
                        title='Register'
                        icon={{ name: 'person-add' }}
                        backgroundColor='#4099FF'
                        onPress={() => navigate(REGISTER_SCREEN_NAME)}
                        buttonStyle={{ borderRadius: 30, width: (SCREEN_WIDTH * 0.75) }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: textColor, fontSize: 16, marginLeft: 10 }}>
                            Already have an account?
                        </Text>
                        <Button
                            title='Login'
                            color='#4099FF'
                            backgroundColor='rgba(0, 0, 0, 0)'
                            onPress={() => navigate(LOGIN_SCREEN_NAME)}
                            buttonStyle={{ marginRight: 10 }}
                        />
                    </View>
                </View>
            );
        }

        const { email, firstName, lastName, gender, thumbPhotoUrl } = currentUser;

        const drawerContent = (
            <View style={{ height: SCREEN_HEIGHT, backgroundColor: componentBackgroundColor }}>
                <View style={[drawerHeaderContainer, { borderBottomColor: borderColor }]}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <RemoteImage
                            source={{ uri: thumbPhotoUrl }}
                            style={[drawerProfilePicture, { borderColor }]}
                        />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[drawerName, { color: textColor }]}>
                            {formatName(firstName, lastName)}
                        </Text>
                        <LocalImage
                            style={{ marginTop: 8, marginHorizontal: 10, width: 15, height: 15 }}
                            source={renderGenderIcon(gender)}
                        />
                    </View>
                    <Text style={drawerEmail}>
                        {email}
                    </Text>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <ListItem
                        title='Friends'
                        titleStyle={[drawerMenuTitle, { color: textColor }]}
                        titleNumberOfLines={1}
                        leftIcon={friends}
                        onPress={() => { }}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                    <ListItem
                        title='Account & Settings'
                        titleStyle={[drawerMenuTitle, { color: textColor }]}
                        titleNumberOfLines={1}
                        leftIcon={settings}
                        onPress={() => { }}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                    <ListItem
                        title='Share with Friends'
                        titleStyle={[drawerMenuTitle, { color: textColor }]}
                        titleNumberOfLines={1}
                        leftIcon={share}
                        onPress={() => { }}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                    <ListItem
                        title='Help Center'
                        titleStyle={[drawerMenuTitle, { color: textColor }]}
                        titleNumberOfLines={1}
                        leftIcon={help}
                        onPress={() => { }}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                    <ListItem
                        title={(
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[drawerMenuTitle, { color: textColor }]}>
                                    Dark Theme
                                </Text>
                                <Switch
                                    style={{ marginHorizontal: 10 }}
                                    value={theme === DARK_THEME}
                                    onValueChange={() => ColorTheme.switchTheme(theme)}
                                    onTintColor='#4099FF'
                                />
                            </View>
                        )}
                        titleNumberOfLines={1}
                        leftIcon={darkTheme}
                        rightIcon={(<View />)}
                        underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                        containerStyle={{ borderBottomWidth: 0, marginBottom: 20 }}
                    />
                </ScrollView>
            </View>
        );

        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type='displace'
                tapToClose={true}
                openDrawerOffset={SCREEN_WIDTH * 0.05}
                content={drawerContent}
                panOpenMask={25}
                panThreshold={0.2}
            >
                <View style={{ flex: 1, backgroundColor }}>
                    <StatusBar barStyle={statusBar} />
                    <Profile
                        profile={currentUser}
                        navigation={navigation}
                        currentUser={currentUser}
                    >
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                height: 20,
                                backgroundColor,
                                borderTopWidth: 1,
                                borderTopColor: borderColor
                            }}
                        />
                        <ListItem
                            title='All Posts'
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={allPosts}
                            onPress={() => { }}
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor, borderTopColor: borderColor }}
                        />
                        <ListItem
                            title='Liked Posts'
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={likedPosts}
                            onPress={() => { }}
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='Albums'
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={album}
                            onPress={() => { }}
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='Deleted Posts'
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={deletedPosts}
                            onPress={() => { }}
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <Seperator backgroundColor={backgroundColor} height={20} />
                        <ListItem
                            title='Moments'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={moments}
                            onPress={() => { }}
                            containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: borderColor, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        />
                        <Seperator backgroundColor={backgroundColor} height={20} />
                        <ListItem
                            title='Edit Profile'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={editProfile}
                            onPress={() => navigate(EDIT_PROFILE_SCREEN_NAME)}
                            containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: borderColor, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        />
                        <ListItem
                            title='Edit Biography'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={biography}
                            onPress={() => navigate(EDIT_BIO_SCREEN_NAME)}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='Change Profile Picture'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={changeProfilePicture}
                            onPress={this.onChangeProfilePicture}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='Change Wallpaper'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={changeWallpaper}
                            onPress={this.onChangeWallpaper}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='QR Code'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={QRCode}
                            onPress={() => { }}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <Seperator backgroundColor={backgroundColor} height={20} />
                        <ListItem
                            title='Create a group'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={createGroup}
                            onPress={() => { }}
                            containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: borderColor, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        />
                        <ListItem
                            title='Joined groups'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={joinedGroups}
                            onPress={() => { }}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <ListItem
                            title='Start a conversation'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={conversation}
                            onPress={() => { }}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                        <Seperator backgroundColor={backgroundColor} height={20} />
                        <ListItem
                            title='People nearby'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={peopleNearby}
                            onPress={() => { }}
                            containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: borderColor, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}
                        />
                        <ListItem
                            title='Discover'
                            underlayColor={DEFAULT_BUTTON_UNDERLAY_COLOR}
                            titleStyle={[drawerMenuTitle, { color: textColor }]}
                            titleNumberOfLines={1}
                            leftIcon={discover}
                            onPress={() => { }}
                            containerStyle={{ borderBottomWidth: 1, backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                        />
                    </Profile>
                    <Icon
                        name='md-menu'
                        type='ionicon'
                        color='white'
                        size={DEFAULT_HEADER_ICON_SIZE}
                        iconStyle={{ padding: 6 }}
                        underlayColor={DEFAULT_TRANSPARENT_BACKGROUND_COLOR}
                        containerStyle={[parallaxHeaderIconContainer, { left: 16 }]}
                        onPress={() => this._drawer.open()}
                    />
                    <Icon
                        name='ios-camera'
                        type='ionicon'
                        color='white'
                        size={DEFAULT_HEADER_ICON_SIZE}
                        iconStyle={{ padding: 6 }}
                        underlayColor={DEFAULT_TRANSPARENT_BACKGROUND_COLOR}
                        containerStyle={[parallaxHeaderIconContainer, { right: 16 }]}
                        onPress={() => navigate(POST_SCREEN_NAME)}
                    />
                </View>
            </Drawer>
        );
    }
}

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(HomeScreen);