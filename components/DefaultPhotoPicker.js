import React, { PureComponent } from 'react';
import { View, ScrollView, ActionSheetIOS, Text, Modal, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

import { ColorTheme, DEFAULT_ACTIVE_OPACITY, DEFAULT_ICON_UNDERLAY_COLOR, addPhotoButtonContainer, charCountContainer, charCountText } from '../styles';

import { ImageModal } from './ImageModal';
import { CustomVideo } from './CustomVideo';

import { SCREEN_WIDTH, LIBRARY_PHOTO_TYPE, ASSET_TYPE_ALL, ASSET_TYPE_PHOTOS, CAMERA_ROLL_SCREEN_NAME, CAMERA_SCREEN_NAME, LIBRARY_VIDEO_TYPE } from '../constants';

/*
required: maxPhotos, navigation, photos, onRemovePhoto, onSelectPhotoComplete, assetType
optional: none
*/
class DefaultPhotoPicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            assetType: LIBRARY_PHOTO_TYPE,
            viewPhoto: false,
            index: 0
        };

        this.renderPhotos = this.renderPhotos.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.viewPhotoDetail = this.viewPhotoDetail.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.pickPhotos = this.pickPhotos.bind(this);
        this.takePhotos = this.takePhotos.bind(this);
        this.onCloseImage = this.onCloseImage.bind(this);
    }

    componentWillMount() {
        const { photos, assetType } = this.props;
        this.setState({ photos, assetType });
    }

    componentWillReceiveProps(nextProps) {
        const { photos, assetType } = nextProps;
        if (photos.length === this.state.photos.length) {
            return;
        }

        this.setState({ photos, assetType });
    }

    renderPhotos() {
        return this.state.photos.map((photo, index) => <View key={index} style={{ marginRight: 10, marginTop: 2 }} >
            <TouchableOpacity
                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                onPress={() => this.viewPhotoDetail(index)}
            >
                <View>
                    <Image
                        source={{ uri: photo }}
                        style={styles.photoStyle}
                    />
                    <Icon
                        name='close'
                        size={20}
                        color='white'
                        containerStyle={{
                            position: 'absolute',
                            top: 0, right: 0,
                            width: 20, height: 20,
                            backgroundColor: '#F44336',
                            borderRadius: 10
                        }}
                        underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                        onPress={() => this.props.onRemovePhoto(index)}
                    />
                </View>
            </TouchableOpacity>
        </View>);
    }

    viewPhotoDetail(index) {
        this.setState({ viewPhoto: true, index });
    }

    renderVideo() {
        return this.state.photos.map((video, index) => <View key={index} style={{ marginRight: 10, marginTop: 2 }}>
            <CustomVideo
                uri={video}
                videoStyle={styles.photoStyle}
                containerStyle={{}}
            />
            <Icon
                name='close'
                size={20}
                color='white'
                containerStyle={{
                    position: 'absolute',
                    top: 0, right: 0,
                    width: 20, height: 20,
                    backgroundColor: '#F44336',
                    borderRadius: 10
                }}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => this.props.onRemovePhoto(index)}
            />
        </View>);
    }

    addPhoto() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                'Choose from Photos',
                'Open Camera',
                'Cancel'
            ],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.pickPhotos();
            } else if (buttonIndex === 1) {
                this.takePhotos();
            }
        });
    }

    pickPhotos() {
        const { photos } = this.state;
        const { maxPhotos, navigation, onSelectPhotoComplete } = this.props;
        const photoCount = photos.length;
        const assetType = photoCount === 0 ? ASSET_TYPE_ALL : ASSET_TYPE_PHOTOS;
        const max = maxPhotos - photoCount;
        const pickPhotoAction = NavigationActions.navigate({
            routeName: CAMERA_ROLL_SCREEN_NAME,
            params: {
                assetType, maxPhotos: max,
                onComplete: (images) => onSelectPhotoComplete(images)
            }
        });

        navigation.dispatch(pickPhotoAction);
    }

    takePhotos() {
        const { photos } = this.state;
        const { maxPhotos, navigation, onSelectPhotoComplete } = this.props;
        const assetType = photos.length === 0 ? ASSET_TYPE_ALL : ASSET_TYPE_PHOTOS;
        const takePhotoAction = NavigationActions.navigate({
            routeName: CAMERA_SCREEN_NAME,
            params: {
                assetType,
                onComplete: (images) => onSelectPhotoComplete(images)
            }
        });

        navigation.dispatch(takePhotoAction);
    }

    onCloseImage() {
        this.setState({ viewPhoto: false });
    }

    render() {
        const { assetType, viewPhoto, index, photos } = this.state;
        const { maxPhotos } = this.props;
        const { photosContainer } = styles;
        const { borderColor, componentBackgroundColor } = ColorTheme.current;

        return (
            <View style={[photosContainer, { borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }]}>
                <ScrollView
                    horizontal={true}
                    keyboardShouldPersistTaps='always'
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: 10 }}
                >
                    {assetType === LIBRARY_PHOTO_TYPE && this.renderPhotos()}
                    {assetType === LIBRARY_VIDEO_TYPE && this.renderVideo()}
                    {photos.length < maxPhotos && assetType !== LIBRARY_VIDEO_TYPE && <Icon
                        name='add'
                        size={addPhotoButtonContainer.width}
                        color={borderColor}
                        underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                        onPress={this.addPhoto}
                        containerStyle={[addPhotoButtonContainer, { borderColor }]}
                    />}
                </ScrollView>
                <View style={[charCountContainer, { marginBottom: 5 }]}>
                    <Text style={charCountText}>
                        {maxPhotos} photos or 1 video
                    </Text>
                </View>
                <Modal
                    visible={viewPhoto}
                    animationType='fade'
                    onRequestClose={this.onCloseImage}
                >
                    <ImageModal
                        photoUrls={photos}
                        initialIndex={index}
                        local={true}
                        onCloseImage={this.onCloseImage}
                    />
                </Modal>
            </View >
        );
    }
}

const styles = {
    photosContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    photoStyle: {
        width: (SCREEN_WIDTH - 36) / 3,
        height: (SCREEN_WIDTH - 36) / 3,
        marginVertical: 10,
        marginRight: 10
    }
};

export { DefaultPhotoPicker };