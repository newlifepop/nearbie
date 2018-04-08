import React from 'react';
import { View } from 'react-native';

import { DEFAULT_HEADER_ICON_SIZE } from '../styles';

const EmptySideHeader = (
    <View
        style={{
            width: DEFAULT_HEADER_ICON_SIZE,
            height: DEFAULT_HEADER_ICON_SIZE,
            backgroundColor: 'rgba(0, 0, 0, 0)'
        }}
    />
);

export { EmptySideHeader };