import React, { PureComponent } from 'react';
import { View, Text, StatusBar, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';

import { PhotoView } from './PhotoView';
import { RemotePhotoView } from './RemotePhotoView';
import { SCREEN_WIDTH } from '../constants';

/*
required: photoUrls, initialIndex, local, onCloseImage
optional: none
*/
class ImageModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            index: -1,
            photoUrls: [],
            local: false
        };

        this.renderItem = this.renderItem.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount() {
        const { initialIndex, photoUrls, local } = this.props;
        this.setState({ index: initialIndex, photoUrls, local });
    }

    componentWillReceiveProps(nextProps) {
        const { initialIndex, photoUrls, local } = nextProps;
        this.setState({ index: initialIndex, photoUrls, local });
    }

    componentDidMount() {
        this._container.scrollToIndex({ animated: false, index: this.props.initialIndex });
    }

    renderItem({ item }) {
        const { onCloseImage } = this.props;

        if (this.state.local) {
            return (
                <PhotoView
                    uri={item}
                    onTap={onCloseImage}
                    onScroll={onCloseImage}
                />
            );
        }

        return (
            <RemotePhotoView
                uri={item}
                onTap={onCloseImage}
                onScroll={onCloseImage}
            />
        );
    }

    onScroll(event) {
        const index = Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH + 0.5);
        if (index >= 0 && index !== this.state.index) {
            this.setState({ index });
        }
    }

    render() {
        const { photoUrls, local, index } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar hidden={true} />
                <FlatList
                    ref={(ref) => this._container = ref}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    data={photoUrls}
                    renderItem={this.renderItem}
                    getItemLayout={(data, index) => (
                        { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
                    )}
                    onScroll={this.onScroll}
                    initialNumToRender={1}
                    initialScrollIndex={index}
                />
                <View
                    style={{
                        position: 'absolute', bottom: 32,
                        left: 0, right: 0, alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            color: 'white',
                            fontSize: 14
                        }}
                    >
                        {index + 1} / {photoUrls.length}
                    </Text>
                </View>
            </View>
        );
    }
}

export { ImageModal };