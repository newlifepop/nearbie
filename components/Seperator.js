import React from 'react';
import { View } from 'react-native';

import { SCREEN_WIDTH } from '../constants';

function Seperator({ height, backgroundColor }) {
    return (
        <View
            style={{
                width: SCREEN_WIDTH, height,
                backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0)'
            }}
        />
    );
}

export { Seperator };