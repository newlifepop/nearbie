import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image as LocalImage, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import RemoteImage from 'react-native-fast-image';

import { CustomImage } from './CustomImage';
import { CustomVideo } from './CustomVideo';
import { Tag } from './Tag';
import { SocialBar } from './SocialBar';
import { EmptyImages } from './EmptyImages';

import { dateToDisplay, getPostPhotosPerLine, getPostPhotoStyle, renderGenderIcon, formatName, formatAddress } from '../actions';

import { ASSET_TYPE_PHOTOS, ASSET_TYPE_VIDEOS } from '../constants';

import { DEFAULT_ACTIVE_OPACITY, DEFAULT_IMAGE_MARGIN, ColorTheme, DEFAULT_ICON_UNDERLAY_COLOR } from '../styles';

/*
required: post, onViewPost, onPressTag, onPressProfilePicture,
          onPressLike, onPressComment, onPressMessage, deletable,
          onPressLocation, viewable, index
optional: onDeletePost (required if deletable === true)
*/
class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0, postId: '', user: null, latitude: 0,
            longitude: 0, formattedAddress: '',
            date: null, message: '', photos: null, tags: [],
            commentCount: 0, likeCount: 0, liked: false
        };
    }

    componentWillMount() {
        const { post, index } = this.props;
        const { postId, user, latitude, longitude, formattedAddress,
            date, message, photos, tags, commentCount, likeCount, liked } = post;
        const { firstName, lastName, gender, uid, photoUrl, thumbPhotoUrl } = user;

        this.setState({
            index, postId, user: { firstName, lastName, gender, uid, photoUrl, thumbPhotoUrl },
            latitude, longitude, formattedAddress, date: new Date(date), message, tags,
            photos: photos ? {
                assetType: photos.assetType,
                photoUrls: photos.photoUrls,
                thumbPhotoUrls: photos.thumbPhotoUrls
            } : null,
            commentCount, likeCount, liked
        });
    }

    componentWillReceiveProps(nextProps) {
        const { index, post, viewable } = nextProps;

        if (!viewable) {
            return;
        }

        const { postId, user, latitude, longitude, formattedAddress,
            date, message, photos, tags, commentCount, likeCount, liked } = post;
        const { firstName, lastName, gender, uid, photoUrl, thumbPhotoUrl } = user;

        this.setState({
            index, postId, user: { firstName, lastName, gender, uid, photoUrl, thumbPhotoUrl },
            latitude, longitude, formattedAddress, date: new Date(date), message, tags,
            photos: photos ? {
                assetType: photos.assetType,
                photoUrls: photos.photoUrls,
                thumbPhotoUrls: photos.thumbPhotoUrls
            } : null,
            commentCount, likeCount, liked
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { liked, likeCount, commentCount, viewable } = nextState;
        const { liked: oldLiked, likeCount: oldLikeCount, commentCount: oldCommentCount } = this.state;

        return viewable && (liked !== oldLiked || commentCount !== oldCommentCount || likeCount !== oldLikeCount);
    }

    renderPhotos() {
        const { photos } = this.state;

        if (!photos) {
            return (<View />);
        }

        switch (photos.assetType) {
            case ASSET_TYPE_PHOTOS:
                return this.renderImages();
            case ASSET_TYPE_VIDEOS:
                return this.renderVideo();
            default:
                return (<View />);
        }
    }

    renderImages() {
        const { photoUrls, thumbPhotoUrls } = this.state.photos;
        const photoCount = photoUrls.length;

        if (!this.props.viewable) {
            return (
                <EmptyImages
                    photoCount={photoCount}
                    photosPerLine={getPostPhotosPerLine(photoCount)}
                    photoStyle={[getPostPhotoStyle(photoCount), { backgroundColor: ColorTheme.current.backgroundColor }]}
                    containerStyle={{
                        flexDirection: 'row',
                        marginHorizontal: 10,
                        marginTop: DEFAULT_IMAGE_MARGIN
                    }}
                />
            );
        }

        return (
            <CustomImage
                photoUrls={photoUrls}
                thumbPhotoUrls={thumbPhotoUrls}
                local={false}
                photosPerLine={getPostPhotosPerLine(photoCount)}
                photoStyle={[getPostPhotoStyle(photoCount), { backgroundColor: ColorTheme.current.backgroundColor }]}
                containerStyle={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginTop: DEFAULT_IMAGE_MARGIN
                }}
            />
        );
    }

    renderVideo() {
        const style = getPostPhotoStyle(1);

        if (!this.props.viewable) {
            return (
                <EmptyImages
                    photoCount={1}
                    photosPerLine={1}
                    photoStyle={[style, { backgroundColor: ColorTheme.current.backgroundColor }]}
                    containerStyle={{
                        flexDirection: 'row',
                        marginHorizontal: 10,
                        marginTop: DEFAULT_IMAGE_MARGIN
                    }}
                />
            );
        }

        return (
            <CustomVideo
                uri={this.state.photos.photoUrls[0]}
                videoStyle={style}
                paused={!this.props.viewable}
                containerStyle={[style, { marginHorizontal: 10, marginTop: DEFAULT_IMAGE_MARGIN }]}
            />
        );
    }

    render() {
        const { index, postId, user, message, date, tags, commentCount,
            likeCount, liked, latitude, longitude, formattedAddress } = this.state;
        const { textColor, borderColor, componentBackgroundColor } = ColorTheme.current;
        const { onPressTag, onPressProfilePicture, onPressLike, onPressComment,
            onPressMessage, deletable, onDeletePost, onPressLocation, onViewPost } = this.props;
        const { firstName, lastName, gender, thumbPhotoUrl, photoUrl, uid } = user;

        return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: componentBackgroundColor }}>
                <TouchableWithoutFeedback onPress={() => onViewPost(index)}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <TouchableOpacity
                                activeOpacity={DEFAULT_ACTIVE_OPACITY}
                                onPress={() => onPressProfilePicture({ uid, thumbPhotoUrl, photoUrl })}
                            >
                                <RemoteImage
                                    source={{ uri: thumbPhotoUrl }}
                                    style={{
                                        width: 50, height: 50,
                                        borderRadius: 25, marginTop: 10,
                                        marginLeft: 10, backgroundColor
                                    }}
                                />
                            </TouchableOpacity>
                            <View style={{ marginLeft: 10, marginTop: 10, justifyContent: 'space-between', height: 50 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: textColor }}>
                                        {formatName(firstName, lastName)}
                                    </Text>
                                    <LocalImage
                                        style={{ marginLeft: 10, width: 20, height: 20 }}
                                        source={renderGenderIcon(gender)}
                                        resizeMethod='resize'
                                    />
                                </View>
                                <Text style={{ color: 'gray', fontStyle: 'italic', fontSize: 14 }}>
                                    {dateToDisplay(date, new Date())}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        onPress={() => onPressLocation(latitude, longitude)}
                        style={{ marginVertical: 5 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name='location-on'
                                size={20}
                                color='#4099FF'
                                containerStyle={{ marginLeft: 10 }}
                            />
                            <Text style={{ fontSize: 14, marginLeft: 5, color: '#4099FF' }}>
                                {formatAddress(formattedAddress)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {message && message !== '' && <Text style={{ marginHorizontal: 10, fontSize: 16, color: textColor }}>
                        {message}
                    </Text>}
                    {this.renderPhotos()}
                </TouchableWithoutFeedback>
                {tags.length !== 0 && <Tag
                    containerStyle={{ margin: 10 }}
                    tags={tags}
                    onPressTag={onPressTag}
                />}
                <SocialBar
                    commentCount={commentCount}
                    likeCount={likeCount}
                    liked={liked}
                    onPressLike={() => onPressLike({ postId, liked })}
                    onPressComment={() => onPressComment({ postId, user })}
                    onPressMessage={() => onPressMessage({ user })}
                />
                {deletable && <Icon
                    type='ionicon'
                    name='ios-trash'
                    size={26}
                    color='#B3B3B3'
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    containerStyle={{ position: 'absolute', top: 10, right: 10 }}
                    onPress={() => onDeletePost({ postId })}
                />}
            </View>
        );
    }
}

export { Post };