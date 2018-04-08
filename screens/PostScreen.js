import React, { Component } from 'react';
import { View, Text, TextInput, Platform, UIManager, LayoutAnimation, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Header, Icon, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import { NavigationActions } from 'react-navigation';

import { Tag, DropdownAlert, DefaultPhotoPicker } from '../components';

import { uploadPost } from '../actions';

import { SCREEN_WIDTH, LIBRARY_PHOTO_TYPE, LOCATION_SCREEN_NAME, PICK_LOCATION_OPERATION, TAG_SCREEN_NAME, MAX_POST_TAGS, MAX_POST_MESSAGE_LENGTH, MAX_POST_PHOTOS, SCREEN_HEIGHT } from '../constants';

import { ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, headerText, charCountContainer, charCountText } from '../styles';

const TAGS = require('../assets/src/data/tags.json');

class PostScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null, tags: [], message: '',
            photos: [], assetType: LIBRARY_PHOTO_TYPE,
            error: '', location: {
                formattedAddress: 'Bridgeport, Chicago, IL, USA',
                coords: {
                    latitude: 41.83498584437659, longitude: -87.6576389045517
                }
            }
        };

        this.onPost = this.onPost.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onRemovePhoto = this.onRemovePhoto.bind(this);
        this.onSelectPhotoComplete = this.onSelectPhotoComplete.bind(this);
        this.onChooseLocation = this.onChooseLocation.bind(this);
        this.onRemoveTag = this.onRemoveTag.bind(this);
        this.onSelectTags = this.onSelectTags.bind(this);
    }

    componentWillMount() {
        let tags = [];
        const length = parseInt(Math.floor(Math.random() * 11));
        for (var i = 0; i < length; ++i) {
            const tag = TAGS[parseInt(Math.floor(Math.random() * 35))];
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }

        ColorTheme.subscribeComponent(this);
        this.setState({ currentUser: this.props.currentUser, tags });
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

    onPost() {
        const { currentUser, message, photos, assetType, location, tags } = this.state;

        if (message.replace(' ', '') === '' && photos.length === 0) {
            this.setState({ error: 'Please add message or photos, a post cannot be empty' });
        } else if (!location || location === '') {
            this.setState({ error: 'Please select a location, this post will be seen by people near it' });
        } else {
            const { formattedAddress, coords } = location;
            const { latitude, longitude } = coords;

            const post = { message, latitude, longitude, tags, formattedAddress, assetType, photos };
            this.props.uploadPost(currentUser, post);
            this.props.navigation.goBack();
        }
    }

    onChangeMessage(text) {
        this.setState({ message: text, error: '' });
    }

    onRemovePhoto(index) {
        let { photos, assetType } = { ...this.state };
        _.pullAt(photos, index);
        this.setState({
            photos, error: '',
            assetType: photos.length === 0 ? LIBRARY_PHOTO_TYPE : assetType
        });
    }

    onSelectPhotoComplete(images) {
        const photos = images.map((image) => image.path);
        this.setState({ photos: [...this.state.photos, ...photos], assetType: images[0].assetType });
    }

    onChooseLocation() {
        const { location } = this.state;

        var latitude = null;
        var longitude = null;
        if (location && location !== '') {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
        }

        const chooseLocationAction = NavigationActions.navigate({
            routeName: LOCATION_SCREEN_NAME,
            params: {
                actionType: PICK_LOCATION_OPERATION, latitude, longitude,
                confirmLocationButtonTitle: 'Confirm Location',
                onComplete: (address) => this.setState({ location: address })
            }
        });

        this.props.navigation.dispatch(chooseLocationAction);
    }

    onRemoveTag(target) {
        let { tags } = { ...this.state };
        _.pull(tags, target);
        this.setState({ tags, error: '' });
    }

    onSelectTags() {
        const selectTagsAction = NavigationActions.navigate({
            routeName: TAG_SCREEN_NAME,
            params: {
                canCreate: true, maxTags: MAX_POST_TAGS - this.state.tags.length,
                onComplete: (tags) => this.setState({ tags: [...this.state.tags, ...tags] })
            }
        });
        this.props.navigation.dispatch(selectTagsAction);
    }

    render() {
        const { currentUser, tags, message, photos, location, error, assetType } = this.state;

        if (!currentUser) {
            return (<View />);
        }

        const { navigation } = this.props;
        const { textColor, backgroundColor, componentBackgroundColor, statusBar, borderColor, iconColor } = ColorTheme.current;
        const { inputContainer, inputStyle, menuItemContainer, menuTitleStyle } = styles;

        const headerLeft = (
            <Icon
                name='close'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={iconColor}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => navigation.goBack()}
            />
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                New Post
            </Text>
        );

        const headerRight = (
            <Icon
                name='done'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={iconColor}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={this.onPost}
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
                    <View style={[inputContainer, { borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }]}>
                        <TextInput
                            style={[inputStyle, { color: textColor }]}
                            placeholder='Say something ...'
                            placeholderTextColor='gray'
                            onChangeText={this.onChangeMessage}
                            multiline={true}
                            maxLength={MAX_POST_MESSAGE_LENGTH}
                            defaultValue={message}
                        />
                        <View style={[charCountContainer, { marginBottom: 5 }]}>
                            <Text style={charCountText}>
                                {message.length} / {MAX_POST_MESSAGE_LENGTH}
                            </Text>
                        </View>
                    </View>
                    <DefaultPhotoPicker
                        maxPhotos={MAX_POST_PHOTOS}
                        navigation={navigation}
                        photos={photos}
                        onRemovePhoto={(index) => this.onRemovePhoto(index)}
                        onSelectPhotoComplete={this.onSelectPhotoComplete}
                        assetType={assetType}
                    />
                    <ListItem
                        title={(!location || location === '') ? 'Location *' : location.formattedAddress}
                        titleNumberOfLines={1}
                        titleStyle={[menuTitleStyle, { color: (!location || location === '') ? 'gray' : '#4099FF' }]}
                        leftIcon={{ name: 'location-on', size: 25 }}
                        containerStyle={[menuItemContainer, { borderBottomColor: borderColor, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: componentBackgroundColor, marginTop: 20 }]}
                        onPress={this.onChooseLocation}
                        underlayColor={componentBackgroundColor}
                    />
                    <ListItem
                        title={tags.length === 0 ? 'Tags' : <Tag
                            tags={tags}
                            containerStyle={{}}
                            onPressTag={this.onRemoveTag}
                        />}
                        titleNumberOfLines={1}
                        titleStyle={[menuTitleStyle, { color: tags.length === 0 ? 'gray' : '#4099FF' }]}
                        leftIcon={{ name: 'filter-list', size: 25 }}
                        containerStyle={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor, marginBottom: 20 }}
                        onPress={this.onSelectTags}
                        underlayColor={componentBackgroundColor}
                    />
                </KeyboardAwareScrollView>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

const styles = {
    inputContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 4,
        borderBottomWidth: 1
    },
    inputStyle: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 18
    },
    menuTitleStyle: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold'
    },
    menuItemContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    }
};

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, { uploadPost })(PostScreen);