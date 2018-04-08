import React, { Component } from 'react';
import {
    View, StatusBar, TouchableOpacity, Text, Platform, UIManager,
    LayoutAnimation, NativeModules, Modal, NativeEventEmitter, Alert
} from 'react-native';
import Camera from 'react-native-camera';
import { Icon } from 'react-native-elements';
import RNFS from 'react-native-fs';

import {
    DEFAULT_ACTIVE_OPACITY, cameraHeaderIconContainer,
    cameraFooterIconContainer, cameraFooterContainer, cameraCaptureButtonContainer,
    DEFAULT_TRANSPARENT_BACKGROUND_COLOR, DARK_THEME_TEXT_COLOR
} from '../styles';

import {
    ASSET_TYPE_PHOTOS, ASSET_TYPE_VIDEOS, LIBRARY_PHOTO_TYPE,
    LIBRARY_VIDEO_TYPE, ASSET_TYPE_ALL, MAXIMUM_ZOOM_SCALE
} from '../constants';

import { VideoModal, DefaultModal, DropdownAlert, PhotoView } from '../components';

import { formatRemainingTime, getRandomId } from '../actions';

const { Type, FlashMode, CaptureMode, CaptureTarget } = Camera.constants;
const { front: cameraTypeFront, back: cameraTypeBack } = Type;
const { on: flashModeOn, off: flashModeOff, auto: flashModeAuto } = FlashMode;
const { still: captureModePhoto, video: captureModeVideo } = CaptureMode;

const CAMERA_VIEW = 'camera';
const PHOTO_VIEW = 'photo';
const ICON_COLOR = 'rgb(200, 200, 200)';
const ICON_SIZE = 36;
const PESDK = NativeModules.PESDK;

/*
required: assetType, onComplete
optional: none
*/
class CameraScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            view: CAMERA_VIEW,
            photo: null,
            cameraType: cameraTypeBack,
            flashMode: flashModeOff,
            captureMode: captureModePhoto,
            assetType: ASSET_TYPE_PHOTOS,
            isRecording: false,
            processing: false,
            timer: null,
            recorded: 0,
            error: ''
        };

        this.renderFlashIcon = this.renderFlashIcon.bind(this);
        this.onSwitchCamera = this.onSwitchCamera.bind(this);
        this.onCapture = this.onCapture.bind(this);
        this.onCapturePhoto = this.onCapturePhoto.bind(this);
        this.onCaptureVideo = this.onCaptureVideo.bind(this);
        this.tick = this.tick.bind(this);
        this.onStopCaptureVideo = this.onStopCaptureVideo.bind(this);
        this.renderCaptureModeButton = this.renderCaptureModeButton.bind(this);
        this.onSwitchCaptureMode = this.onSwitchCaptureMode.bind(this);
        this.renderCapturePhotoButton = this.renderCapturePhotoButton.bind(this);
        this.renderCancelButton = this.renderCancelButton.bind(this);
        this.renderView = this.renderView.bind(this);
        this.renderCameraView = this.renderCameraView.bind(this);
        this.renderPhotoView = this.renderPhotoView.bind(this);
        this.renderRetakeButton = this.renderRetakeButton.bind(this);
        this.renderCompleteButton = this.renderCompleteButton.bind(this);
        this.onCancelEditPhoto = this.onCancelEditPhoto.bind(this);
        this.onEditPhotoSuccess = this.onEditPhotoSuccess.bind(this);
        this.onEditPhotoFail = this.onEditPhotoFail.bind(this);
        this.onEditPhoto = this.onEditPhoto.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    componentWillMount() {
        const { assetType } = this.props.navigation.state.params;
        switch (assetType) {
            case ASSET_TYPE_VIDEOS:
                this.setState({ assetType, captureMode: captureModeVideo });
                break;
            default:
                this.setState({ assetType, captureMode: captureModePhoto });
                break;
        }

        this.eventEmitter = new NativeEventEmitter(NativeModules.PESDK);
        this.eventEmitter.addListener('PhotoEditorDidCancel', this.onCancelEditPhoto);
        this.eventEmitter.addListener('PhotoEditorDidSave', (body) => this.onEditPhotoSuccess(body));
        this.eventEmitter.addListener('PhotoEditorDidFailToGeneratePhoto', this.onEditPhotoFail);
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        this.eventEmitter.removeAllListeners('PhotoEditorDidCancel');
        this.eventEmitter.removeAllListeners('PhotoEditorDidSave');
        this.eventEmitter.removeAllListeners('PhotoEditorDidFailToGeneratePhoto');
    }

    onCancelEditPhoto() {
        this.setState({ processing: false });
    }

    onEditPhotoSuccess(body) {
        const path = `${RNFS.TemporaryDirectoryPath}${getRandomId()}.jpg`;
        RNFS.writeFile(path, body.image, 'base64')
            .then(() => this.setState({
                processing: false,
                photo: { assetType: LIBRARY_PHOTO_TYPE, path }
            }))
            .catch((error) => this.setState({
                processing: false,
                error: 'Unable to edit this photo, please try again'
            }));
    }

    onEditPhotoFail() {
        this.setState({
            processing: false,
            error: 'Unable to edit this photo, please try again'
        });
    }

    renderFlashIcon() {
        switch (this.state.flashMode) {
            case flashModeAuto:
                return (
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={[cameraHeaderIconContainer, { left: 16, top: 16 }]}
                        onPress={() => this.setState({ flashMode: flashModeOn })}
                    >
                        <Icon
                            name='flash-auto'
                            size={28}
                            color={ICON_COLOR}
                        />
                    </TouchableOpacity>
                );
            case flashModeOn:
                return (
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={[cameraHeaderIconContainer, { left: 16, top: 16 }]}
                        onPress={() => this.setState({ flashMode: flashModeOff })}
                    >
                        <Icon
                            name='flash-on'
                            size={28}
                            color={ICON_COLOR}
                        />
                    </TouchableOpacity>
                );
            default:
                return (
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={[cameraHeaderIconContainer, { left: 16, top: 16 }]}
                        onPress={() => this.setState({ flashMode: flashModeAuto })}
                    >
                        <Icon
                            name='flash-off'
                            size={28}
                            color={ICON_COLOR}
                        />
                    </TouchableOpacity>
                );
        }
    }

    onSwitchCamera() {
        this.setState({
            cameraType: this.state.cameraType === cameraTypeFront ?
                cameraTypeBack
                :
                cameraTypeFront
        });
    }

    onCapture() {
        const { captureMode, isRecording } = this.state;

        switch (captureMode) {
            case captureModePhoto:
                this.onCapturePhoto();
                break;
            case captureModeVideo:
                if (isRecording) {
                    this.onStopCaptureVideo();
                } else {
                    this.onCaptureVideo();
                }
                break;
            default: break;
        }
    }

    onCapturePhoto() {
        this._camera.capture({
            mode: captureModePhoto,
            target: CaptureTarget.temp,
            jpegQuality: 100
        }).then(({ path }) => this.setState({
            view: PHOTO_VIEW, photo: {
                assetType: LIBRARY_PHOTO_TYPE, path
            }
        })).catch((error) => console.log(error));
    }

    onCaptureVideo() {
        this.setState({ isRecording: true, timer: setInterval(this.tick, 1000) }, () => {
            this._camera.capture({
                mode: captureModeVideo,
                target: CaptureTarget.temp,
                totalSeconds: 5999
            }).then(({ path }) => this.setState({
                view: PHOTO_VIEW,
                photo: { assetType: LIBRARY_VIDEO_TYPE, path }
            })).catch((error) => console.log(error));
        });
    }

    tick() {
        this.setState({ recorded: this.state.recorded + 1 });
    }

    onStopCaptureVideo() {
        window.clearInterval(this.state.timer);
        this.setState({
            isRecording: false, timer: null, recorded: 0
        }, () => this._camera.stopCapture());
    }

    renderCaptureModeButton() {
        const { captureMode, assetType, isRecording } = this.state;

        if (assetType !== ASSET_TYPE_ALL || isRecording) {
            const { width, height, margin } = cameraFooterIconContainer;

            return (<View style={{ width, height, margin }} />);
        }

        switch (captureMode) {
            case captureModePhoto:
                return (
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        onPress={this.onSwitchCaptureMode}
                        style={cameraFooterIconContainer}
                    >
                        <Icon
                            type='ionicon'
                            name='ios-videocam-outline'
                            color='#F44336'
                            size={ICON_SIZE}
                        />
                    </TouchableOpacity>
                );
            case captureModeVideo:
                return (
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        onPress={this.onSwitchCaptureMode}
                        style={cameraFooterIconContainer}
                    >
                        <Icon
                            type='ionicon'
                            name='ios-camera-outline'
                            color={ICON_COLOR}
                            size={ICON_SIZE}
                        />
                    </TouchableOpacity>
                );
            default:
                this.setState({ captureMode: captureModePhoto });
                return (<View />);
        }
    }

    renderCapturePhotoButton() {
        switch (this.state.captureMode) {
            case captureModePhoto:
                return (
                    <Icon
                        type='ionicon'
                        name='ios-camera-outline'
                        color={ICON_COLOR}
                        size={ICON_SIZE}
                    />
                );
            case captureModeVideo:
                return (
                    <Icon
                        type='ionicon'
                        name='ios-videocam-outline'
                        color='#F44336'
                        size={ICON_SIZE}
                    />
                );
            default:
                this.setState({ captureMode: captureModePhoto });
                return (<View />);
        }
    }

    onSwitchCaptureMode() {
        this.setState({
            captureMode: this.state.captureMode === captureModePhoto ?
                captureModeVideo
                :
                captureModePhoto
        });
    }

    renderCancelButton() {
        if (this.state.isRecording) {
            const { width, height, margin } = cameraFooterIconContainer;

            return (<View style={{ width, height, margin }} />);
        }

        return (
            <TouchableOpacity
                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                onPress={() => this.props.navigation.goBack()}
                style={cameraFooterIconContainer}
            >
                <Icon
                    name='close'
                    size={ICON_SIZE}
                    color={ICON_COLOR}
                />
            </TouchableOpacity>
        );
    }

    renderView() {
        switch (this.state.view) {
            case PHOTO_VIEW:
                return this.renderPhotoView();
            case CAMERA_VIEW:
            default:
                return this.renderCameraView();
        }
    }

    renderCameraView() {
        const { captureMode, cameraType, flashMode, isRecording, recorded } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <Camera
                    ref={(ref) => this._camera = ref}
                    style={{ flex: 1 }}
                    captureAudio={true}
                    captureMode={captureMode}
                    captureTarget={CaptureTarget.temp}
                    type={cameraType}
                    flashMode={flashMode}
                    cropToPreview={true}
                    playSoundOnCapture={true}
                    onZoomChanged={() => { }}
                    onFocusChanged={() => { }}
                >
                    <View style={cameraFooterContainer}>
                        {this.renderCancelButton()}
                        <TouchableOpacity
                            activeOpacity={DEFAULT_ACTIVE_OPACITY}
                            onPress={this.onCapture}
                            style={cameraCaptureButtonContainer}
                        >
                            {this.renderCapturePhotoButton()}
                        </TouchableOpacity>
                        {this.renderCaptureModeButton()}
                    </View>
                </Camera>
                {captureMode !== captureModeVideo && this.renderFlashIcon()}
                {!isRecording && <TouchableOpacity
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    style={[cameraHeaderIconContainer, { top: 16, right: 16 }]}
                    onPress={this.onSwitchCamera}
                >
                    <Icon
                        type='ionicon'
                        name='ios-reverse-camera-outline'
                        color={ICON_COLOR}
                        size={ICON_SIZE}
                    />
                </TouchableOpacity>}
                {isRecording && <View
                    style={{
                        position: 'absolute', borderRadius: 5,
                        top: 10, left: 10, width: 80, height: 30,
                        backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR,
                        justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <Text style={{ color: DARK_THEME_TEXT_COLOR, fontSize: 18 }}>
                        {formatRemainingTime(recorded)}
                    </Text>
                </View>}
            </View>
        );
    }

    renderPhotoView() {
        const { photo } = this.state;

        if (!photo) {
            this.setState({ view: CAMERA_VIEW });
            return;
        }

        const { assetType, path } = photo;

        switch (assetType) {
            case LIBRARY_PHOTO_TYPE:
                return (
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <PhotoView
                            uri={path}
                            onTap={() => { }}
                            onScroll={() => { }}
                        />
                        <View style={cameraFooterContainer}>
                            {this.renderRetakeButton()}
                            <TouchableOpacity
                                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                                onPress={this.onEditPhoto}
                                style={cameraCaptureButtonContainer}
                            >
                                <Icon
                                    type='ionicon'
                                    name='ios-color-wand'
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />
                            </TouchableOpacity>
                            {this.renderCompleteButton()}
                        </View>
                    </View>
                );
            case LIBRARY_VIDEO_TYPE:
                return (
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <VideoModal
                            uri={path}
                            onExitFullScreen={() => this.setState({ view: CAMERA_VIEW, photo: null })}
                        />
                        <View style={[cameraFooterContainer, { bottom: null, top: 16 }]}>
                            {this.renderRetakeButton()}
                            {this.renderCompleteButton()}
                        </View>
                    </View>
                );
            default:
                this.setState({ view: CAMERA_VIEW });
                break;
        }
    }

    onEditPhoto() {
        this.setState({ processing: true }, () => PESDK.present(this.state.photo.path));
    }

    renderRetakeButton() {
        return (
            <TouchableOpacity
                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                onPress={() => this.setState({ view: CAMERA_VIEW, photo: null })}
                style={cameraFooterIconContainer}
            >
                <Icon
                    name='close'
                    size={ICON_SIZE}
                    color={ICON_COLOR}
                />
            </TouchableOpacity>
        );
    }

    renderCompleteButton() {
        return (
            <TouchableOpacity
                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                onPress={this.onComplete}
                style={cameraFooterIconContainer}
            >
                <Icon
                    name='done'
                    size={ICON_SIZE}
                    color={ICON_COLOR}
                />
            </TouchableOpacity>
        );
    }

    onComplete() {
        const { photo } = this.state;

        if (!photo) {
            this.setState({ error: 'Unknown error, please try again' });
            return;
        }

        const { assetType, path } = photo;
        this.props.navigation.state.params.onComplete([{ assetType, path }]);
        this.props.navigation.goBack();
    }

    render() {
        const { processing, error } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar hidden={true} />
                {this.renderView()}
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

export default CameraScreen;