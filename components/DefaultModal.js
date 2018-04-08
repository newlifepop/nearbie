import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

import { DEFAULT_TRANSPARENT_BACKGROUND_COLOR, DARK_THEME_TEXT_COLOR } from '../styles';

import { SCREEN_WIDTH } from '../constants';

const width = SCREEN_WIDTH / 3;

function DefaultModal({ text }) {
    return (
        <View
            style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
                backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR
            }}
        >
            <View
                style={{
                    borderRadius: 10, alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    justifyContent: 'center', flexDirection: 'row'
                }}
            >
                <ActivityIndicator
                    size='small'
                    color={DARK_THEME_TEXT_COLOR}
                    style={{ marginLeft: 30, marginVertical: 20 }}
                />
                <Text
                    style={{
                        fontSize: 18, marginLeft: 10,
                        color: DARK_THEME_TEXT_COLOR,
                        marginVertical: 20, marginRight: 30
                    }}
                >
                    {text || 'Processing ...'}
                </Text>
            </View>
        </View>
    );
}

export { DefaultModal };