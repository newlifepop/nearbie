import React, { Component } from 'react';
import { Modal, View, TouchableOpacity, Text, StatusBar, LayoutAnimation, UIManager, Platform, ActionSheetIOS, FlatList } from 'react-native';
import { Header, Icon, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import Axios from 'axios';
import _ from 'lodash';
import Flag from 'react-native-flags';

import { DropdownAlert, DefaultModal } from '../components';

import { findNationality } from '../actions';

import { formInputStyle, ColorTheme, headerText, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, DEFAULT_ACTIVE_OPACITY } from '../styles';

import { UPDATE_NATIONALITY_URL } from '../constants';

class EditNationalityScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            currentUser: null,
            nationality: '',
            query: '',
            countries: []
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.searchCountries = _.debounce(this.searchNationality, 300);
        this.onRemoveNationality = this.onRemoveNationality.bind(this);
        this.onChooseNationality = this.onChooseNationality.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { nationality } = currentUser;
        this.setState({ currentUser, nationality: nationality ? nationality : '' });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { nationality } = currentUser;
        this.setState({ currentUser, nationality: nationality ? nationality : '' });
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
        const { currentUser, nationality } = this.state;

        if (!nationality || nationality === '') {
            this.setState({ error: 'Please select your nationality' });
        } else {
            const { uid, hash } = currentUser;
            this.setState({ loading: true, error: '' }, () => {
                Axios.post(UPDATE_NATIONALITY_URL, { uid, hash, nationality })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch((error) => this.setState({ loading: false, error: 'Unable to update nationality, please try again' }));
            });
        }
    }

    onChangeText(text) {
        this.setState({ query: text, error: '' }, this.searchCountries);
    }

    searchNationality() {
        this.setState({ countries: findNationality(this.state.query) });
    }

    onRemoveNationality() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Do you want to delete your nationality?',
            options: [
                'Remove nationality',
                'Cancel'
            ],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.setState({ loading: true, error: '' }, () => {
                    const { uid, hash } = this.state.currentUser;
                    Axios.post(UPDATE_NATIONALITY_URL, { uid, hash, nationality: null })
                        .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                        .catch((error) => this.setState({ loading: false, error: 'Unable to remove nationality, please try again' }));
                });
            }
        });
    }

    onChooseNationality(code) {
        this.setState({ nationality: code, error: '', query: '', countries: [] });
    }

    render() {
        const { currentUser, loading, query, error, nationality, countries } = this.state;
        const { textColor, componentBackgroundColor, backgroundColor, borderColor, statusBar, iconColor } = ColorTheme.current;

        if (!currentUser) {
            return (<View />);
        }

        const headerLeft = (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name='close'
                    size={DEFAULT_HEADER_ICON_SIZE}
                    color={iconColor}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={() => this.props.navigation.goBack()}
                />
                <View style={{ width: DEFAULT_HEADER_ICON_SIZE + 20 }} />
            </View>
        );

        const headerCenter = (
            <Text style={[headerText, { color: textColor }]}>
                Edit Nationality
            </Text>
        );

        const headerRight = (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name='delete-forever'
                    size={DEFAULT_HEADER_ICON_SIZE}
                    color='#F44336'
                    containerStyle={{ marginRight: 20 }}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={this.onRemoveNationality}
                />
                <Icon
                    name='backup'
                    size={DEFAULT_HEADER_ICON_SIZE}
                    color={iconColor}
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    onPress={this.onSubmitChanges}
                />
            </View>
        );

        return (
            <View style={{ flex: 1, backgroundColor }}>
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomWidth: 0 }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <View
                    style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: componentBackgroundColor,
                        borderBottomWidth: 1, borderBottomColor: borderColor
                    }}
                >
                    <SearchBar
                        containerStyle={{
                            backgroundColor: componentBackgroundColor,
                            borderTopWidth: 0, borderBottomWidth: 0, flex: 1
                        }}
                        autoFocus={true}
                        inputStyle={{ backgroundColor, color: textColor }}
                        placeholder='Search'
                        placeholderTextColor={textColor}
                        onChangeText={this.onChangeText}
                        value={query}
                    />
                    {nationality !== '' && <Flag
                        code={nationality}
                        size={32}
                        type='flat'
                        style={{ marginRight: 10 }}
                    />}
                </View>
                <FlatList
                    data={countries}
                    keyExtractor={(item) => item.code}
                    keyboardShouldPersistTaps='always'
                    renderItem={({ item }) => (<TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={{
                            backgroundColor: componentBackgroundColor,
                            borderBottomWidth: 1, borderBottomColor: borderColor
                        }}
                        onPress={() => this.onChooseNationality(item.code)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Flag
                                code={item.code}
                                size={32}
                                type='flat'
                                style={{ margin: 10, marginRight: 0 }}
                            />
                            <Text style={{ fontSize: 18, color: textColor, margin: 10 }}>
                                {item.country}
                            </Text>
                        </View>
                    </TouchableOpacity>)}
                />
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating nationality ...' />
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

export default connect(mapStateToProps, null)(EditNationalityScreen);