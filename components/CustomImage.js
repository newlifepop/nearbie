import React, { PureComponent } from 'react';
import { View, Modal, Image as LocalImage, TouchableOpacity } from 'react-native';
import RemoteImage from 'react-native-fast-image';

import { ImageModal } from './ImageModal';

import { DEFAULT_ACTIVE_OPACITY } from '../styles';

/*
required: thumbPhotoUrls, photoUrls, local, photosPerLine, photoStyle
optional: containerStyle
*/
class CustomImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            thumbPhotoUrls: [],
            photoUrls: [],
            photosPerLine: 0,
            local: false,
            viewPhotoDetail: false,
            index: -1
        };

        this.renderPhotos = this.renderPhotos.bind(this);
        this.renderLine = this.renderLine.bind(this);
        this.renderLinePhotos = this.renderLinePhotos.bind(this);
        this.viewPhotoDetail = this.viewPhotoDetail.bind(this);
        this.onCloseImage = this.onCloseImage.bind(this);
    }

    componentWillMount() {
        const { thumbPhotoUrls, photoUrls, local, photosPerLine } = this.props;
        this.setState({ local, photoUrls, thumbPhotoUrls, photosPerLine });
    }

    componentWillReceiveProps(nextProps) {
        const { thumbPhotoUrls, photoUrls, local, photosPerLine } = nextProps;
        this.setState({ local, photoUrls, thumbPhotoUrls, photosPerLine });
    }

    renderPhotos() {
        const { thumbPhotoUrls, photosPerLine } = this.state;
        const line = Array.from(Array(Math.ceil(thumbPhotoUrls.length / photosPerLine)).keys());
        return line.map((value, index) => {
            return this.renderLine(index);
        });
    }

    renderLine(line) {
        const { thumbPhotoUrls, photosPerLine } = this.state;
        const urls = thumbPhotoUrls.slice(line * photosPerLine, line * photosPerLine + photosPerLine);

        return (
            <View
                key={line}
                style={this.props.containerStyle || {}}
            >
                {this.renderLinePhotos(thumbPhotoUrls, line, urls)}
            </View>
        );
    }

    renderLinePhotos(thumbPhotoUrls, line, urls) {
        const { photosPerLine, photoStyle } = this.props;
        const { local } = this.state;

        return urls.map((url, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    onPress={() => this.viewPhotoDetail(index + line * photosPerLine)}
                >
                    {local && <LocalImage
                        source={{ uri: url }}
                        style={photoStyle}
                    />}
                    {!local && <RemoteImage
                        source={{ uri: url }}
                        style={photoStyle}
                    />}
                </TouchableOpacity>
            );
        });
    }

    viewPhotoDetail(index) {
        this.setState({ viewPhotoDetail: true, index });
    }

    onCloseImage() {
        this.setState({ viewPhotoDetail: false, index: -1 });
    }

    render() {
        const { viewPhotoDetail, photoUrls, index, local } = this.state;

        return (
            <View>
                {this.renderPhotos()}
                <Modal
                    visible={viewPhotoDetail}
                    animationType='fade'
                    onRequestClose={this.onCloseImage}
                >
                    <ImageModal
                        photoUrls={photoUrls}
                        initialIndex={index}
                        local={local}
                        onCloseImage={this.onCloseImage}
                    />
                </Modal>
            </View>
        );
    }
}

export { CustomImage };