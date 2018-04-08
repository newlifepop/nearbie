import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabViewAnimated } from 'react-native-tab-view';

import {
    SCREEN_WIDTH, SEARCH_SCREEN_NAME, COMMUNITY_SCREEN_NAME,
    MESSAGE_SCREEN_NAME, NOTIFICATION_SCREEN_NAME, HOME_SCREEN_NAME
} from '../constants';

import { tabBarContainer, ColorTheme, tabBarIconContainer } from '../styles';

const DEFAULT_TAB_BAR_ICON_SIZE = 30;

import SearchScreen from './SearchScreen';
import CommunityScreen from './CommunityScreen';
import NotificationScreen from './NotificationScreen';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';

class MainScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: SEARCH_SCREEN_NAME, icon: 'ios-compass-outline', selectedIcon: 'ios-compass' },
                { key: COMMUNITY_SCREEN_NAME, icon: 'ios-people-outline', selectedIcon: 'ios-people' },
                { key: MESSAGE_SCREEN_NAME, icon: 'ios-mail-outline', selectedIcon: 'ios-mail' },
                { key: NOTIFICATION_SCREEN_NAME, icon: 'ios-notifications-outline', selectedIcon: 'ios-notifications' },
                { key: HOME_SCREEN_NAME, icon: 'ios-person-outline', selectedIcon: 'ios-person' }
            ]
        };

        this.renderScene = this.renderScene.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
    }

    componentWillUnmount() {
        ColorTheme.unsubscribeComponent(this);
    }

    renderScene({ route }) {
        const { navigation } = this.props;

        switch (route.key) {
            case SEARCH_SCREEN_NAME:
                return (<SearchScreen navigation={navigation} />);
            case COMMUNITY_SCREEN_NAME:
                return (<CommunityScreen />);
            case NOTIFICATION_SCREEN_NAME:
                return (<NotificationScreen navigation={navigation} />);
            case MESSAGE_SCREEN_NAME:
                return (<MessageScreen navigation={navigation} />);
            case HOME_SCREEN_NAME:
                return (<HomeScreen navigation={navigation} />);
            default:
                return (<View />);
        }
    }

    renderFooter(props) {
        const { index: currentTab } = this.state;
        const { componentBackgroundColor, borderColor, iconColor } = ColorTheme.current;

        return (
            <View style={[tabBarContainer, { borderTopColor: borderColor, backgroundColor: componentBackgroundColor }]}>
                {props.navigationState.routes.map((route, index) => {
                    const { key, icon, selectedIcon } = route;

                    return (
                        <TouchableWithoutFeedback
                            key={key}
                            style={{ flex: 1 }}
                            onPress={() => props.jumpToIndex(index)}
                        >
                            <View style={tabBarIconContainer}>
                                <Icon
                                    name={currentTab === index ? selectedIcon : icon}
                                    size={DEFAULT_TAB_BAR_ICON_SIZE}
                                    color={index === currentTab ? '#4099FF' : iconColor}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        );
    }

    render() {
        return (
            <TabViewAnimated
                navigationState={this.state}
                renderScene={this.renderScene}
                renderFooter={this.renderFooter}
                onIndexChange={(index) => this.setState({ index })}
                animationEnabled={false}
                swipeEnabled={false}
                lazy={true}
            />
        );
    }
}

export default MainScreen;