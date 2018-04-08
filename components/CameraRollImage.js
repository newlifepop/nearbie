import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements';

import { SCREEN_WIDTH, LIBRARY_VIDEO_TYPE, LIBRARY_PHOTO_TYPE, PHOTO_PICKER_NUM_COLUMNS } from '../constants';

import { DEFAULT_ACTIVE_OPACITY, DARK_THEME_COMPONENT_BACKGROUND_COLOR, DEFAULT_TRANSPARENT_BACKGROUND_COLOR } from '../styles';

const PHOTO_SIZE = SCREEN_WIDTH / PHOTO_PICKER_NUM_COLUMNS;

/*
required: uri, index, assetType, viewable, disabled, onSelectPhoto, onEditPhoto
optional: none
*/
class CameraRollImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            assetType: '',  // LIBRARY_PHOTO_TYPE or LIBRARY_VIDEO_TYPE
            index: -1,
            disabled: false,
            viewable: false
        };
    }

    componentWillMount() {
        const { uri, index, assetType, disabled, viewable } = this.props;
        this.setState({ uri, index, assetType, disabled, viewable });
    }

    componentWillReceiveProps(nextProps) {
        const { index, disabled, viewable } = nextProps;
        this.setState({ index, disabled, viewable });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.viewable;
    }

    render() {
        const { uri, assetType, index, disabled, viewable } = this.state;

        if (!viewable) {
            return (<View
                style={{
                    width: PHOTO_SIZE, height: PHOTO_SIZE,
                    backgroundColor: DARK_THEME_COMPONENT_BACKGROUND_COLOR
                }}
            />);
        }

        return (
            <View
                style={{
                    width: PHOTO_SIZE, height: PHOTO_SIZE,
                    backgroundColor: DARK_THEME_COMPONENT_BACKGROUND_COLOR
                }}
            >
                <TouchableOpacity
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    disabled={disabled}
                    onPress={() => this.props.onSelectPhoto({ uri, index, assetType })}
                >
                    <Image
                        source={{ uri }}
                        resizeMethod='resize'
                        style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
                    />
                </TouchableOpacity>
                {disabled && <View
                    style={{
                        position: 'absolute',
                        backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR,
                        width: PHOTO_SIZE, height: PHOTO_SIZE
                    }}
                />}
                {assetType === LIBRARY_VIDEO_TYPE && <Icon
                    name='theaters'
                    size={18}
                    color='white'
                    containerStyle={{
                        position: 'absolute', bottom: 5, right: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center', alignItems: 'center',
                        width: 24, height: 24, borderRadius: 12
                    }}
                />}
                {index !== -1 && <View
                    style={{
                        position: 'absolute',
                        top: 5, right: 5,
                        width: 26, height: 26,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#4099FF',
                        borderRadius: 13
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>
                        {index + 1}
                    </Text>
                </View>}
                {assetType === LIBRARY_PHOTO_TYPE && index !== -1 && <Icon
                    name='edit'
                    size={20}
                    color='rgb(200, 200, 200)'
                    underlayColor={DEFAULT_TRANSPARENT_BACKGROUND_COLOR}
                    containerStyle={{
                        position: 'absolute',
                        bottom: 5, left: 5,
                        width: 26, height: 26,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR,
                        borderRadius: 13
                    }}
                    onPress={() => this.props.onEditPhoto({ index })}
                />}
            </View>
        );
    }
}

export { CameraRollImage };