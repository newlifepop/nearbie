import React, { Component } from 'react';
import { View, StatusBar, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';

import { ColorTheme, headerText } from '../styles';

class MessageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        this.setState({ currentUser: this.props.currentUser });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentUser: nextProps.currentUser });
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        ColorTheme.unsubscribeComponent(this);
    }

    render() {
        const { backgroundColor, componentBackgroundColor, statusBar, textColor, borderColor } = ColorTheme.current;

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Message
            </Text>
        );

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                    centerComponent={headerCenter}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(MessageScreen);