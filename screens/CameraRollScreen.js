import React, { Component } from 'react';
import {
    View, StatusBar, FlatList, NativeModules,
    CameraRoll, Modal, NativeEventEmitter, Text
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';

const PESDK = NativeModules.PESDK;

import { CameraRollImage, DropdownAlert, EmptySideHeader, DefaultModal } from '../components';

import { headerText, DEFAULT_HEADER_ICON_SIZE, DARK_THEME_ICON_COLOR, DEFAULT_ICON_UNDERLAY_COLOR, DARK_THEME_TEXT_COLOR, DARK_THEME_MAIN_BACKGROUND_COLOR, DARK_THEME_BORDER_COLOR } from '../styles';

import { LIBRARY_PHOTO_TYPE, LIBRARY_VIDEO_TYPE, PHOTO_PICKER_NUM_COLUMNS, ASSET_TYPE_ALL, ASSET_TYPE_PHOTOS, ASSET_TYPE_VIDEOS } from '../constants';

import { getParameterByName, getRandomId } from '../actions';

/*
required: maxPhotos, assetType, onComplete
optional: none
*/
class CameraRollScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            selected: [],
            viewablePhotos: [],
            error: '',
            editing: -1,
            processing: false
        };

        this.onEditPhotoSuccess = this.onEditPhotoSuccess.bind(this);
        this.onEditPhotoFail = this.onEditPhotoFail.bind(this);
        this.onCancelEditPhoto = this.onCancelEditPhoto.bind(this);
        this.renderPhoto = this.renderPhoto.bind(this);
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.onEditPhoto = this.onEditPhoto.bind(this);
        this.getSubtitle = this.getSubtitle.bind(this);
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    }

    componentWillMount() {
        CameraRoll.getPhotos({
            first: Number.MAX_VALUE,
            assetType: this.props.navigation.state.params.assetType
        }).then((photos) => {
            let images = [];
            photos.edges.forEach((photo) => {
                const { image, type: assetType } = photo.node;
                images.push({ assetType, uri: image.uri });
            });
            this.setState({ photos: images });
        }).catch((error) => this.setState({ error: 'Unable to access your camera roll, please try again' }));

        this.eventEmitter = new NativeEventEmitter(NativeModules.PESDK);
        this.eventEmitter.addListener('PhotoEditorDidCancel', this.onCancelEditPhoto);
        this.eventEmitter.addListener('PhotoEditorDidSave', (body) => this.onEditPhotoSuccess(body));
        this.eventEmitter.addListener('PhotoEditorDidFailToGeneratePhoto', this.onEditPhotoFail);
    }

    componentWillUnmount() {
        this.eventEmitter.removeAllListeners('PhotoEditorDidCancel');
        this.eventEmitter.removeAllListeners('PhotoEditorDidSave');
        this.eventEmitter.removeAllListeners('PhotoEditorDidFailToGeneratePhoto');
    }

    onCancelEditPhoto() {
        this.setState({
            processing: false,
            editing: -1,
            selected: this.props.navigation.state.params.maxPhotos === 1 ?
                []
                :
                this.state.selected
        });
    }

    onEditPhotoSuccess(body) {
        const { maxPhotos, onComplete } = this.props.navigation.state.params;

        const path = `${RNFS.TemporaryDirectoryPath}${getRandomId()}.jpg`;
        RNFS.writeFile(path, body.image, 'base64')
            .then(() => {
                if (maxPhotos === 1) {
                    onComplete([{ assetType: LIBRARY_PHOTO_TYPE, path }]);
                    this.props.navigation.goBack();
                } else {
                    let { selected, editing } = { ...this.state };
                    selected[editing] = { uri: selected[editing].uri, path };
                    this.setState({ processing: false, selected, editing: -1 });
                }
            })
            .catch((error) => this.setState({
                processing: false, editing: -1,
                error: 'Unable to save this editted photo, please try again'
            }));
    }

    onEditPhotoFail() {
        this.setState({
            processing: false,
            editing: -1,
            error: 'Unable to edit this photo, please try again'
        });
    }

    renderPhoto({ item }) {
        const { uri, assetType } = item;
        const { selected, viewablePhotos } = this.state;
        var index = -1;
        for (var i = 0; i < selected.length; ++i) {
            if (selected[i].uri === uri) {
                index = i;
                break;
            }
        }

        return (
            <CameraRollImage
                uri={uri}
                index={index}
                assetType={assetType}
                viewable={_.includes(viewablePhotos, uri)}
                onSelectPhoto={this.onSelectPhoto}
                onEditPhoto={this.onEditPhoto}
                disabled={
                    index === -1
                    &&
                    (selected.length >= this.props.navigation.state.params.maxPhotos ||
                        (assetType === LIBRARY_VIDEO_TYPE && selected.length !== 0))
                }
            />
        );
    }

    onSelectPhoto({ uri, index, assetType }) {
        const { maxPhotos, onComplete } = this.props.navigation.state.params;
        if (maxPhotos === 1 || assetType === LIBRARY_VIDEO_TYPE) {
            this.setState({ processing: true });
            if (assetType === LIBRARY_VIDEO_TYPE) {
                const path = `${RNFS.TemporaryDirectoryPath}video.${getParameterByName('ext', uri).toLowerCase()}`;
                RNFS.copyAssetsVideoIOS(uri, path)
                    .then(() => {
                        this.setState({ processing: false }, () => {
                            onComplete([{ assetType: LIBRARY_VIDEO_TYPE, path }]);
                            this.props.navigation.goBack();
                        });
                    })
                    .catch((error) => this.setState({ processing: false, error: 'Unable to select this video, please try again' }));
            } else {
                const path = `${RNFS.TemporaryDirectoryPath}image.${getParameterByName('ext', uri).toLowerCase()}`;
                RNFS.copyAssetsFileIOS(uri, path, 0, 0, 1, 1, 'contain')
                    .then(() => PESDK.present(path))
                    .catch(() => this.setState({ processing: false, error: 'Unable to select this photo, please try again' }));
            }
        } else {
            let selected = [...this.state.selected];
            if (index === -1) {
                selected.push({ uri, path: uri });
            } else {
                _.pullAt(selected, index);
            }

            this.setState({ selected });
        }
    }

    async onComplete() {
        const { selected } = this.state;

        if (selected.length <= 0) {
            this.setState({ error: 'You forgot to select any photos or video.' });
            return;
        }

        this.setState({ processing: true });

        let photos = [];
        for (var i = 0; i < selected.length; ++i) {
            const { uri, path } = selected[i];
            if (uri === path) {
                const imagePath = `${RNFS.TemporaryDirectoryPath}${getRandomId()}.${getParameterByName('ext', uri).toLowerCase()}`;
                await RNFS.copyAssetsFileIOS(uri, imagePath, 0, 0, 1, 1, 'contain')
                    .then(() => photos.push({ assetType: LIBRARY_PHOTO_TYPE, path: imagePath }))
                    .catch(() => this.setState({
                        processing: false,
                        error: `Unable to select photo #${i + 1}, please try again`
                    }));
            } else {
                photos.push({ assetType: LIBRARY_PHOTO_TYPE, path });
            }
        }

        this.setState({ processing: false }, () => {
            this.props.navigation.state.params.onComplete(photos);
            this.props.navigation.goBack();
        });
    }

    getSubtitle() {
        const { assetType, maxPhotos } = this.props.navigation.state.params;

        switch (assetType) {
            case ASSET_TYPE_ALL:
                return `Select ${maxPhotos} photo(s) or 1 video`;
            case ASSET_TYPE_PHOTOS:
                return `Select ${maxPhotos} photo(s)`;
            case ASSET_TYPE_VIDEOS:
                return 'Select 1 video';
            default:
                return '';
        }
    }

    onEditPhoto({ index }) {
        this.setState({ processing: true, editing: index });

        const { uri, path } = this.state.selected[index];
        if (uri === path) {
            const imagePath = `${RNFS.TemporaryDirectoryPath}image.${getParameterByName('ext', uri).toLowerCase()}`;
            RNFS.copyAssetsFileIOS(uri, imagePath, 0, 0, 1, 1, 'contain')
                .then(() => PESDK.present(imagePath))
                .catch(() => this.setState({ processing: false, editing: -1, error: 'Unable to edit this photo, please try again' }));
        } else {
            PESDK.present(path);
        }
    }

    onViewableItemsChanged({ viewableItems }) {
        let viewablePhotos = [];
        viewableItems.forEach((viewableItem) => viewablePhotos.push(viewableItem.key));
        this.setState({ viewablePhotos });
    }

    render() {
        const { photos, error, processing } = this.state;

        const headerLeft = (
            <Icon
                name='close'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={DARK_THEME_ICON_COLOR}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const headerCenter = (
            <View style={{ alignItems: 'center' }}>
                <Text style={[headerText, { color: DARK_THEME_TEXT_COLOR, fontSize: 20 }]}>
                    All Photos
                </Text>
                <Text style={{ color: DARK_THEME_TEXT_COLOR, fontSize: 12 }}>
                    {this.getSubtitle()}
                </Text>
            </View>
        );

        const headerRight = this.props.navigation.state.params.maxPhotos === 1 ? EmptySideHeader : (
            <Icon
                name='done'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={DARK_THEME_ICON_COLOR}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={this.onComplete}
            />
        );

        return (
            <View style={{ flex: 1, backgroundColor: DARK_THEME_MAIN_BACKGROUND_COLOR }}>
                <StatusBar barStyle='light-content' />
                <Header
                    outerContainerStyles={{ backgroundColor: DARK_THEME_MAIN_BACKGROUND_COLOR, borderBottomColor: DARK_THEME_BORDER_COLOR }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <FlatList
                    data={photos}
                    extraData={this.state}
                    keyExtractor={(item) => item.uri}
                    numColumns={PHOTO_PICKER_NUM_COLUMNS}
                    renderItem={this.renderPhoto}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                />
                <Modal
                    visible={processing}
                    animationType='fade'
                    transparent={true}
                    onRequestClose={() => this.setState({ processing: false })}
                >
                    <DefaultModal />
                </Modal>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

export default CameraRollScreen;