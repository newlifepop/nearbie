import React from 'react';
import { ScrollView, TouchableWithoutFeedback, Image, StatusBar } from 'react-native';

import { MAXIMUM_ZOOM_SCALE, CLOSE_IMAGE_THRESHOLD, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

/*
required: uri, onTap, onScroll
optional: none
*/
function PhotoView({ uri, onTap, onScroll }) {
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
                />
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

export { PhotoView };