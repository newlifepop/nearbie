import React, { PureComponent } from 'react';
import { ScrollView, TouchableWithoutFeedback, StatusBar } from 'react-native';
import * as Progress from 'react-native-progress';
import Image from 'react-native-fast-image';

import { MAXIMUM_ZOOM_SCALE, CLOSE_IMAGE_THRESHOLD, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

/*
required: uri, onTap, onScroll
optional: none
*/
class RemotePhotoView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            progress: 0,
            indeterminate: true
        };

        this.onProgress = this.onProgress.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
    }

    componentWillMount() {
        this.setState({ uri: this.props.uri });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ uri: nextProps.uri });
    }

    onProgress(event) {
        const { loaded, total } = event.nativeEvent;
        const progress = loaded / total;
        if ((progress - this.state.progress) >= 0.1 || progress >= 1.0) {
            this.setState({ progress });
        }
    }

    onLoadStart() {
        this.setState({ indeterminate: false });
    }

    render() {
        const { progress, uri, indeterminate } = this.state;
        const { onScroll, onTap } = this.props;

        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: 'black' }}
                maximumZoomScale={MAXIMUM_ZOOM_SCALE}
                minimumZoomScale={1.0}
                onScrollEndDrag={(event) => {
                    const { x, y } = event.nativeEvent.contentOffset;
                    if (x === 0 && Math.abs(y) >= CLOSE_IMAGE_THRESHOLD) {
                        onScroll();
                    }
                }}
            >
                <StatusBar hidden={true} />
                <TouchableWithoutFeedback onPress={onTap} style={{ flex: 1 }}>
                    <Image
                        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                        source={{ uri }}
                        resizeMode='contain'
                        onProgress={this.onProgress}
                        onLoadStart={this.onLoadStart}
                    />
                </TouchableWithoutFeedback>
                {progress < 1 && <Progress.Bar
                    progress={progress}
                    width={SCREEN_WIDTH}
                    height={2}
                    borderWidth={0}
                    color='#4099FF'
                    indeterminate={indeterminate}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                />}
            </ScrollView>
        );
    }
}

export { RemotePhotoView };