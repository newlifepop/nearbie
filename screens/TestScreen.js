import React, { Component } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';

class TestScreen extends Component {
    constructor(props) {
        super(props);
        
        this.opacity = new Animated.Value(0);

        this.toggleBackgroundColor = this.toggleBackgroundColor.bind(this);
    }

    toggleBackgroundColor() {
        Animated.timing(this.opacity, {
            toValue: this.opacity._value ? 0 : 1,
            duration: 1000
        }).start();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#8BC34A'
                }}
            >
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: '#4099FF', zIndex: 1 }}
                    onPress={this.toggleBackgroundColor}
                >
                    <Text style={{ fontSize: 18, color: '#4099FF', margin: 16 }}>
                        Toggle
                    </Text>
                </TouchableOpacity>
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: 0, right: 0, bottom: 0, top: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#E9E9E9',
                        opacity: this.opacity
                    }}
                />
            </View>
        );
    }
}

export default TestScreen;