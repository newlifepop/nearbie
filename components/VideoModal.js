import React, { PureComponent } from 'react';
import { View, Text, Animated, TouchableWithoutFeedback, ScrollView, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { Icon, Header } from 'react-native-elements';
import Slider from 'react-native-slider';

import { formatRemainingTime } from '../actions';

import { SCREEN_WIDTH, SCREEN_HEIGHT, CLOSE_IMAGE_THRESHOLD, MAXIMUM_ZOOM_SCALE } from '../constants';

import { DARK_THEME_ICON_COLOR, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, DARK_THEME_TEXT_COLOR, DARK_THEME_COMPONENT_BACKGROUND_COLOR, DARK_THEME_MAIN_BACKGROUND_COLOR } from '../styles';

const footerHeight = 50;

/*
required: uri, onExitFullScreen
optional: none
*/
class VideoModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            duration: 0,
            played: 0,
            paused: false
        };

        this.onProgress = this.onProgress.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);

        this.footerPosition = new Animated.Value(5);
    }

    componentWillMount() {
        this.setState({ uri: this.props.uri });
    }

    onProgress({ currentTime, seekableDuration }) {
        this.setState({ played: currentTime, duration: seekableDuration });
    }

    toggleMenu() {
        StatusBar.setHidden(this.footerPosition._value === 5, 'fade');
        Animated.timing(this.footerPosition, {
            toValue: this.footerPosition._value === 5 ? -footerHeight : 5,
            duration: 250
        }).start();
    }

    render() {
        const { uri, duration, played, paused } = this.state;
        const { onExitFullScreen } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: DARK_THEME_MAIN_BACKGROUND_COLOR }}>
                <StatusBar barStyle='light-content' />
                <ScrollView
                    style={{ flex: 1 }}
                    maximumZoomScale={MAXIMUM_ZOOM_SCALE}
                    minimumZoomScale={1.0}
                    onScrollEndDrag={(event) => {
                        const { x, y } = event.nativeEvent.contentOffset;
                        if (x === 0 && y <= -CLOSE_IMAGE_THRESHOLD) {
                            StatusBar.setHidden(false, 'fade');
                            onExitFullScreen({ played });
                        }
                    }}
                >
                    <TouchableWithoutFeedback onPress={this.toggleMenu}>
                        <Video
                            ref={(ref) => this._player = ref}
                            source={{ uri }}
                            style={{
                                width: SCREEN_WIDTH,
                                height: SCREEN_HEIGHT,
                                backgroundColor: DARK_THEME_MAIN_BACKGROUND_COLOR
                            }}
                            rate={1.0}
                            volume={1.0}
                            paused={paused}
                            resizeMode='contain'
                            repeat={true}
                            playInBackground={false}
                            playWhenInactive={false}
                            ignoreSilentSwitch='ignore'
                            progressUpdateInterval={250}
                            onProgress={this.onProgress}
                        />
                    </TouchableWithoutFeedback>
                </ScrollView>
                <Animated.View
                    style={{
                        height: footerHeight,
                        position: 'absolute',
                        left: 5, right: 5,
                        bottom: this.footerPosition,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        flexDirection: 'row', alignItems: 'center'
                    }}
                >
                    <Icon
                        name={paused ? 'play-arrow' : 'pause'}
                        size={32}
                        color={DARK_THEME_ICON_COLOR}
                        containerStyle={{ marginLeft: 5 }}
                        underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                        onPress={() => this.setState({ paused: !paused })}
                    />
                    <Slider
                        style={{ flex: 1, marginLeft: 5 }}
                        maximumValue={duration}
                        minimumValue={0}
                        value={played}
                        onValueChange={(value) => this._player.seek(value)}
                        minimumTrackTintColor='#4099FF'
                        maximumTrackTintColor={DARK_THEME_ICON_COLOR}
                        thumbTintColor='#4099FF'
                    />
                    <Text
                        style={{
                            color: DARK_THEME_TEXT_COLOR,
                            fontSize: 18, fontWeight: 'bold',
                            width: 60, textAlign: 'center',
                            marginLeft: 5
                        }}
                    >
                        {formatRemainingTime(duration - played)}
                    </Text>
                    <Icon
                        name='fullscreen-exit'
                        size={32}
                        color={DARK_THEME_ICON_COLOR}
                        containerStyle={{ marginHorizontal: 5 }}
                        underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                        onPress={() => onExitFullScreen({ played })}
                    />
                </Animated.View>
            </View>
        );
    }
}

export { VideoModal };