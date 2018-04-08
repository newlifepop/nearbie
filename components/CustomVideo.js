import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Video from 'react-native-video';

import { VideoModal } from './VideoModal';

import { videoPlayerMenuContainer, videoPlayerTimer, DEFAULT_ACTIVE_OPACITY } from '../styles';

import { formatRemainingTime } from '../actions';

/*
required: uri, videoStyle, containerStyle
optional: paused
*/
class CustomVideo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            paused: false,
            fullScreen: false,
            duration: 0,
            played: 0,
        };

        this.onProgress = this.onProgress.bind(this);
        this.onExitFullScreen = this.onExitFullScreen.bind(this);
    }

    componentWillMount() {
        const { uri, paused } = this.props;
        this.setState({ uri, paused: paused === undefined ? false : paused });
    }

    componentWillReceiveProps(nextProps) {
        const { paused } = nextProps;
        this.setState({ paused: paused === undefined ? false : paused });
    }

    onProgress({ currentTime, seekableDuration }) {
        this.setState({ played: currentTime, duration: seekableDuration });
    }

    onExitFullScreen({ played }) {
        this.setState({ fullScreen: false }, () => this._player.seek(played));
    }

    render() {
        const { uri, played, paused, duration, fullScreen } = this.state;
        const { videoStyle, containerStyle } = this.props;

        return (
            <View style={containerStyle}>
                <TouchableOpacity
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    onPress={() => this.setState({ fullScreen: true })}
                >
                    <Video
                        ref={(ref) => this._player = ref}
                        source={{ uri }}
                        style={[videoStyle, { backgroundColor: 'black' }]}
                        rate={1.0}
                        volume={1.0}
                        muted={true}
                        paused={paused || fullScreen}
                        resizeMode='contain'
                        repeat={true}
                        playInBackground={false}
                        playWhenInactive={false}
                        progressUpdateInterval={250}
                        onProgress={this.onProgress}
                    />
                </TouchableOpacity>
                <View style={videoPlayerMenuContainer}>
                    <Text style={videoPlayerTimer}>
                        {formatRemainingTime(duration - played)}
                    </Text>
                </View>
                <Modal
                    visible={fullScreen}
                    animationType='slide'
                    onRequestClose={this.onExitFullScreen}
                >
                    <VideoModal
                        uri={uri}
                        onExitFullScreen={this.onExitFullScreen}
                    />
                </Modal>
            </View>
        );
    }
}

export { CustomVideo };