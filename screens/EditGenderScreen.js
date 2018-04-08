import React, { Component } from 'react';
import { View, Text, LayoutAnimation, UIManager, Platform, StatusBar, Image, Modal, ScrollView } from 'react-native';
import { Header, Icon, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Axios from 'axios';

import { renderGenderIcon } from '../actions';

import { buttonGroupContainer, ColorTheme, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, headerText, formLabelStyle } from '../styles';

import { UPDATE_GENDER_URL, GENDERS } from '../constants';

import { DropdownAlert, DefaultModal } from '../components';

class EditGenderScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            currentUser: null,
            gender: ''
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { gender } = currentUser;
        this.setState({ currentUser, gender });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { gender } = currentUser;
        this.setState({ currentUser, gender });
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

    onSubmitChanges() {
        const { currentUser, gender } = this.state;

        if (!_.includes(GENDERS, gender)) {
            this.setState({ error: 'Please select your gender' });
        } else {
            const { uid, hash } = currentUser;
            this.setState({ loading: true, error: '' }, () => {
                Axios.post(UPDATE_GENDER_URL, { uid, hash, gender })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch((error) => this.setState({ loading: false, error: 'Unable to update gender, please try again' }));
            });
        }
    }

    onChangeGender(selectedIndex) {
        this.setState({ gender: GENDERS[selectedIndex], error: '' });
    }

    render() {
        const { currentUser, gender, loading, error } = this.state;
        const { statusBar, textColor, componentBackgroundColor, backgroundColor, borderColor, iconColor } = ColorTheme.current;

        if (!currentUser) {
            return (<View />);
        }

        const headerLeft = (
            <Icon
                name='close'
                size={DEFAULT_HEADER_ICON_SIZE}
                color={iconColor}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Edit Gender
            </Text>
        );

        const headerRight = (
            <Icon
                name='backup'
                color={iconColor}
                size={DEFAULT_HEADER_ICON_SIZE}
                underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                onPress={this.onSubmitChanges}
            />
        );

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomColor: borderColor }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={formLabelStyle}>
                            Select Your Gender *
                        </Text>
                        <Image
                            style={{ height: 20, width: 20, marginHorizontal: 10, marginTop: 10 }}
                            source={renderGenderIcon(gender)}
                        />
                    </View>
                    <ButtonGroup
                        textStyle={{ color: textColor, fontSize: 16 }}
                        onPress={this.onChangeGender}
                        selectedIndex={GENDERS.indexOf(gender)}
                        underlayColor='rgba(0, 0, 0, 0)'
                        buttons={GENDERS}
                        containerStyle={[buttonGroupContainer, { marginTop: 20, borderColor }]}
                        innerBorderStyle={{ width: 1, color: borderColor }}
                        selectedTextStyle={{ color: 'white' }}
                        selectedButtonStyle={{ backgroundColor: '#4099FF' }}
                    />
                </ScrollView>
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating gender ...' />
                </Modal>
                <DropdownAlert error={error} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    const currentUser = state.account;
    return { currentUser };
}

export default connect(mapStateToProps, null)(EditGenderScreen);