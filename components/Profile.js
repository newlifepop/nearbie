import React, { PureComponent } from 'react';
import { View, Animated, Text, TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import Image from 'react-native-fast-image';
import Flag from 'react-native-flags';
import { NavigationActions } from 'react-navigation';
import HyperLink from 'react-native-hyperlink';

import { CustomImage } from './CustomImage';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

import {
    ColorTheme, DEFAULT_ACTIVE_OPACITY, detailedInfoContainer,
    DEFAULT_DETAILED_INFO_ICON_SIZE, detailedInfoText, DEFAULT_ICON_UNDERLAY_COLOR,
    DEFAULT_PROFILE_PICTURE_SIZE, headerText, defaultProfilePicture
} from '../styles';

import {
    formatName, viewLocation, formatAddress, formatBirthday,
    getJobIconName, formatJobTitle, renderGenderIcon
} from '../actions';

const parallaxHeaderHeight = 170;
const stickyHeaderHeight = 70;
const scroll = parallaxHeaderHeight - stickyHeaderHeight;
const contentPaddingTop = parallaxHeaderHeight - DEFAULT_PROFILE_PICTURE_SIZE / 2;
const profilePictureOffset = DEFAULT_PROFILE_PICTURE_SIZE / 4;

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            liftWallpaper: false
        };

        this.scrollY = new Animated.Value(0);
    }

    componentWillMount() {
        this.setState({ profile: this.props.profile });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ profile: nextProps.profile });
    }

    render() {
        const { navigation, currentUser, children } = this.props;
        const { profile, liftWallpaper } = this.state;
        const { uid, firstName, lastName, gender, photoUrl, thumbPhotoUrl,
            wallpaperUrl, birthday, job, location, bio, nationality } = profile;
        const { backgroundColor, componentBackgroundColor, textColor, borderColor, iconColor } = ColorTheme.current;

        const headerCenter = (
            <Text style={[headerText, { color: 'white' }]}>
                {formatName(firstName, lastName)}
            </Text>
        );

        return (
            <View style={{ flex: 1, backgroundColor: componentBackgroundColor }}>
                <Animated.View
                    style={{
                        backgroundColor: componentBackgroundColor,
                        position: 'absolute', left: 0, right: 0,
                        top: 0, width: SCREEN_WIDTH, zIndex: liftWallpaper ? 1 : 0,
                        height: parallaxHeaderHeight,
                        transform: [
                            {
                                translateY: this.scrollY.interpolate({
                                    inputRange: [-1, 0, scroll, scroll + 1],
                                    outputRange: [0, 0, -scroll, -scroll]
                                })
                            },
                            {
                                scale: this.scrollY.interpolate({
                                    inputRange: [-SCREEN_HEIGHT, 0, 1],
                                    outputRange: [9, 1, 1]
                                })
                            }
                        ]
                    }}
                >
                    {wallpaperUrl && <Image
                        source={{ uri: wallpaperUrl }}
                        resizeMode='cover'
                        style={{ width: SCREEN_WIDTH, height: parallaxHeaderHeight }}
                    />}
                    {!wallpaperUrl && <View
                        style={{
                            width: SCREEN_WIDTH,
                            height: parallaxHeaderHeight,
                            backgroundColor: '#4099FF'
                        }}
                    />}
                    <Animated.View
                        style={{
                            position: 'absolute', top: 0,
                            left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            opacity: this.scrollY.interpolate({
                                inputRange: [0, scroll, scroll + DEFAULT_PROFILE_PICTURE_SIZE / 2],
                                outputRange: [0, 0, 1]
                            })
                        }}
                    >
                        <View style={{ flex: 1 }} />
                        <Header
                            outerContainerStyles={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderBottomWidth: 0 }}
                            centerComponent={headerCenter}
                        />
                    </Animated.View>
                </Animated.View>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                        {
                            useNativeDriver: true, listener: (event) => {
                                const { y } = event.nativeEvent.contentOffset;
                                if (y >= scroll && !liftWallpaper) {
                                    this.setState({ liftWallpaper: true });
                                } else if (y < scroll && liftWallpaper) {
                                    this.setState({ liftWallpaper: false });
                                }
                            }
                        }
                    )}
                    contentContainerStyle={{ paddingTop: contentPaddingTop }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Animated.View
                            style={[defaultProfilePicture, {
                                marginLeft: 10, marginBottom: 5, transform: [
                                    {
                                        translateY: this.scrollY.interpolate({
                                            inputRange: [-1, 0, scroll, scroll + 1],
                                            outputRange: [0, 0, profilePictureOffset, profilePictureOffset]
                                        })
                                    },
                                    {
                                        scale: this.scrollY.interpolate({
                                            inputRange: [-1, 0, scroll, scroll + 1],
                                            outputRange: [1, 1, 0.5, 0.5]
                                        })
                                    }
                                ]
                            }]}
                        >
                            <CustomImage
                                thumbPhotoUrls={[thumbPhotoUrl]}
                                photoUrls={[photoUrl]}
                                local={false}
                                photosPerLine={1}
                                photoStyle={defaultProfilePicture}
                            />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: DEFAULT_PROFILE_PICTURE_SIZE / 2 }}>
                                <Text style={{ color: textColor, fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                    {formatName(firstName, lastName)}
                                </Text>
                                <Image
                                    source={renderGenderIcon(gender)}
                                    style={{ width: 20, height: 20, marginHorizontal: 10 }}
                                />
                                {nationality && <Flag
                                    code={nationality}
                                    type='flat'
                                    size={24}
                                    style={{ marginRight: 10 }}
                                />}
                            </View>
                        </View>
                    </View>
                    {location && <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        onPress={() => viewLocation(location, navigation)}
                    >
                        <View style={detailedInfoContainer}>
                            <Icon
                                name='location-on'
                                size={DEFAULT_DETAILED_INFO_ICON_SIZE}
                                color='#4099FF'
                                containerStyle={{ marginLeft: 10 }}
                            />
                            <Text style={[detailedInfoText, { color: '#4099FF' }]}>
                                {formatAddress(location.formattedAddress)}
                            </Text>
                        </View>
                    </TouchableOpacity>}
                    {birthday && <View style={detailedInfoContainer}>
                        <Icon
                            name='cake'
                            size={DEFAULT_DETAILED_INFO_ICON_SIZE}
                            color={textColor}
                            containerStyle={{ marginLeft: 10 }}
                        />
                        <Text style={[detailedInfoText, { color: textColor }]}>
                            Born on {formatBirthday(new Date(birthday))}
                        </Text>
                    </View>}
                    {job && <View style={detailedInfoContainer}>
                        <Icon
                            name={getJobIconName(job.type)}
                            size={DEFAULT_DETAILED_INFO_ICON_SIZE}
                            color={textColor}
                            containerStyle={{ marginLeft: 10 }}
                        />
                        <Text style={[detailedInfoText, { color: textColor }]}>
                            {formatJobTitle(job.title)}
                        </Text>
                    </View>}
                    <View style={{ marginBottom: 5 }}>
                        <HyperLink
                            linkDefault={true}
                            linkStyle={{ color: '#4099FF' }}
                        >
                            <Text style={[detailedInfoText, { color: textColor, marginLeft: 10 }]}>
                                {(!bio || bio === '') ? '(This user prefers to stay a little mysterious)' : bio}
                            </Text>
                        </HyperLink>
                    </View>
                    {children}
                </Animated.ScrollView>
            </View>
        );
    }
}

export { Profile };