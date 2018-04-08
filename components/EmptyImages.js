import React from 'react';
import { View } from 'react-native';

function EmptyImages({ photoCount, photosPerLine, photoStyle, containerStyle }) {
    const lines = Math.ceil(photoCount / photosPerLine);

    return Array.from(Array(lines).keys()).map((line, index) => <View key={index} style={containerStyle}>
        {
            Array.from(Array(line === lines - 1 ? photoCount - photosPerLine * index : photosPerLine).keys()).map((l, i) => <View
                key={i}
                style={photoStyle}
            />)
        }
    </View>);
}

export { EmptyImages };