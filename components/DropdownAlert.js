import React, { PureComponent } from 'react';
import { View, Text, Animated, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

import { SCREEN_HEIGHT } from '../constants';

import { ColorTheme } from '../styles';

class DropdownAlert extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            height: 0
        };

        this.isOpen = new Animated.Value(0);

        this.onLayout = this.onLayout.bind(this);
        this.onCloseAlert = this.onCloseAlert.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { error } = nextProps;
        if (error === this.state.error) {
            return;
        }

        this.setState({ error });
        if (error !== '') {
            Animated.timing(this.isOpen, {
                toValue: 1, duration: 450
            }).start();
        }
    }

    onLayout(event) {
        this.setState({ height: event.nativeEvent.layout.height });
    }

    onCloseAlert() {
        Animated.timing(this.isOpen, {
            toValue: 0,
            duration: 450
        }).start(() => {
            this.setState({ error: '' });
            StatusBar.setBarStyle(ColorTheme.current.statusBar);
        });
    }

    render() {
        const { height, error } = this.state;

        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    transform: [
                        {
                            translateY: this.isOpen.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-height, 0]
                            })
                        }
                    ]
                }}
            >
                <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={this.onCloseAlert}
                    onLayout={this.onLayout}
                >
                    {error === '' ? <View /> : <View
                        style={{
                            backgroundColor: '#CC3232',
                            flexDirection: 'row', alignItems: 'center',
                            padding: 10, paddingTop: 24
                        }}
                    >
                        <StatusBar barStyle='light-content' />
                        <Icon
                            name='error-outline'
                            color='white'
                            size={32}
                        />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
                                Error
                            </Text>
                            <Text style={{ color: 'white', fontSize: 14 }}>
                                {error}
                            </Text>
                        </View>
                    </View>}
                </TouchableWithoutFeedback>
            </Animated.View>
        );
    }
}

export { DropdownAlert };