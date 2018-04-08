import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Badge } from 'react-native-elements';

import { tagContainer, tagText } from '../styles';

/*
required: tags, containerStyle, onPressTag
optional: none
*/
function Tag({ tags, containerStyle, onPressTag }) {
    return (
        <ScrollView
            style={containerStyle}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
        >
            {
                tags.map((tag, index) => <Badge
                    key={index}
                    containerStyle={tagContainer}
                    onPress={() => onPressTag(tag)}
                >
                    <Text style={tagText}>
                        {tag}
                    </Text>
                </Badge>)
            }
        </ScrollView>
    );
}

export { Tag };