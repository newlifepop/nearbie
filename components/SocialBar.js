import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { DEFAULT_ACTIVE_OPACITY, socialBarIconContainer, socialBarQuantityStyle } from '../styles';

/*
required: commentCount, likeCount, liked, onPressLike
          onPressMessage, onPressComment
optional: iconSize
*/

const DEFAULT_ICON_SIZE = 22;
const DEFAULT_ICON_COLOR = 'gray';

class SocialBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            commentCount: 0,
            likeCount: 0,
            liked: false
        };
    }

    componentWillMount() {
        const { commentCount, likeCount, liked } = this.props;
        this.setState({ commentCount, likeCount, liked });
    }

    componentWillReceiveProps(nextProps) {
        const { commentCount, likeCount, liked } = nextProps;
        this.setState({ commentCount, likeCount, liked });
    }

    render() {
        const { iconSize, onPressComment, onPressMessage, onPressLike } = this.props;
        const { likeCount, liked, commentCount } = this.state;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    onPress={onPressComment}
                >
                    <View style={socialBarIconContainer}>
                        <Icon
                            type='ionicon'
                            name='ios-chatbubbles-outline'
                            size={iconSize || DEFAULT_ICON_SIZE}
                            color={DEFAULT_ICON_COLOR}
                        />
                        {commentCount > 0 && <Text style={socialBarQuantityStyle}>
                            {commentCount}
                        </Text>}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={socialBarIconContainer}
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    onPress={onPressMessage}
                >
                    <Icon
                        type='ionicon'
                        name='ios-mail-outline'
                        size={iconSize || DEFAULT_ICON_SIZE}
                        color={DEFAULT_ICON_COLOR}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={DEFAULT_ACTIVE_OPACITY}
                    onPress={onPressLike}
                >
                    <View style={socialBarIconContainer}>
                        <Icon
                            type='ionicon'
                            name={liked ? 'ios-heart' : 'ios-heart-outline'}
                            size={iconSize || DEFAULT_ICON_SIZE}
                            color={liked ? '#F44336' : DEFAULT_ICON_COLOR}
                        />
                        <Text style={[socialBarQuantityStyle, { color: liked ? DEFAULT_ICON_COLOR : '#F44336' }]}>
                            {likeCount}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export { SocialBar };