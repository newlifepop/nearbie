import React, { Component } from 'react';
import {
    View, Platform, UIManager, LayoutAnimation, Modal, StyleSheet,
    StatusBar, TouchableWithoutFeedback, Text, Alert, ActivityIndicator
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Icon, Button } from 'react-native-elements';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import _ from 'lodash';
import Axios from 'axios';

import { getCurrentLocation } from '../actions';

import { DEFAULT_LATITUDE_DELTA, PICK_LOCATION_OPERATION, DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_LONGITUDE_DELTA, VIEW_LOCATION_OPERATION, SEARCH_LOCATION_URL, SCREEN_WIDTH } from '../constants';

import {
    DEFAULT_ICON_UNDERLAY_COLOR, closeButtonContainer, addressInputContainer,
    addressInputButton, confirmAddressButtonContainer, currentLocationButtonContainer, DEFAULT_TRANSPARENT_BACKGROUND_COLOR
} from '../styles';

const findingLocation = require('../assets/src/animations/finding_location.json');
const animationSize = SCREEN_WIDTH / 2;

/*
required: actionType, latitude, longitude
optional: onComplete (required when actionType === PICK_LOCATION_OPERATION),
          confirmLocationButtonTitle
*/
class LocationScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA
            },
            location: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA
            },
            loading: false,
            processing: false,
            actionType: VIEW_LOCATION_OPERATION
        };

        this.renderMapView = this.renderMapView.bind(this);
        this.renderPickLocationMapView = this.renderPickLocationMapView.bind(this);
        this.renderViewLocationMapView = this.renderViewLocationMapView.bind(this);
        this.renderConfirmLocationButton = this.renderConfirmLocationButton.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.onConfirmLocation = this.onConfirmLocation.bind(this);
        this.searchByAddress = this.searchByAddress.bind(this);
        this.gotoMyLocation = this.gotoMyLocation.bind(this);
    }

    componentWillMount() {
        const { actionType, latitude, longitude } = this.props.navigation.state.params;

        switch (actionType) {
            case VIEW_LOCATION_OPERATION:
                this.setState({
                    actionType: VIEW_LOCATION_OPERATION,
                    region: {
                        latitude, longitude,
                        latitudeDelta: DEFAULT_LATITUDE_DELTA,
                        longitudeDelta: DEFAULT_LONGITUDE_DELTA
                    },
                    location: {
                        latitude, longitude,
                        latitudeDelta: DEFAULT_LATITUDE_DELTA,
                        longitudeDelta: DEFAULT_LONGITUDE_DELTA
                    }
                });
                break;
            case PICK_LOCATION_OPERATION:
                if (latitude && longitude) {
                    this.setState({
                        actionType: PICK_LOCATION_OPERATION,
                        region: {
                            latitude, longitude,
                            latitudeDelta: DEFAULT_LATITUDE_DELTA,
                            longitudeDelta: DEFAULT_LONGITUDE_DELTA
                        },
                        location: {
                            latitude, longitude,
                            latitudeDelta: DEFAULT_LATITUDE_DELTA,
                            longitudeDelta: DEFAULT_LONGITUDE_DELTA
                        }
                    });
                } else {
                    this.setState({ loading: true }, () => {
                        getCurrentLocation((lat, lng) => {
                            this.setState({
                                actionType: PICK_LOCATION_OPERATION,
                                loading: false,
                                region: {
                                    latitude: lat, longitude: lng,
                                    latitudeDelta: DEFAULT_LATITUDE_DELTA,
                                    longitudeDelta: DEFAULT_LONGITUDE_DELTA
                                },
                                location: {
                                    latitude: lat, longitude: lng,
                                    latitudeDelta: DEFAULT_LATITUDE_DELTA,
                                    longitudeDelta: DEFAULT_LONGITUDE_DELTA
                                }
                            });
                        });
                    });
                }
                break;
            default:
                break;
        }
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    renderMapView() {
        switch (this.state.actionType) {
            case PICK_LOCATION_OPERATION:
                return this.renderPickLocationMapView();
            case VIEW_LOCATION_OPERATION:
                return this.renderViewLocationMapView();
            default:
                return (<View />);
        }
    }

    renderPickLocationMapView() {
        const { region, loading, processing } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                <MapView
                    ref={(ref) => this._mapView = ref}
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    initialRegion={region}
                    loadingEnabled={true}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                />
                <View style={addressInputContainer}>
                    <TouchableWithoutFeedback
                        onPress={this.searchByAddress}
                        disabled={loading}
                    >
                        <View style={addressInputButton}>
                            <Icon
                                name='search'
                                size={22}
                                color='#B5B5B5'
                                containerStyle={{ marginLeft: 10 }}
                            />
                            <Text style={{ fontSize: 16, color: '#B5B5B5', marginRight: 10, marginVertical: 12 }}>
                                Search by address
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <Icon
                        name='close'
                        size={30}
                        color='rgba(50, 50, 50, 0.8)'
                        containerStyle={{ marginLeft: 10 }}
                        underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                        onPress={() => {
                            if (loading) {
                                return;
                            }
                            this.props.navigation.goBack();
                        }}
                    />
                </View>
                <View style={confirmAddressButtonContainer}>
                    {this.renderConfirmLocationButton()}
                </View>
                <View style={currentLocationButtonContainer}>
                    <Icon
                        name='my-location'
                        raised={true}
                        size={24}
                        color='#4196E1'
                        onPress={this.gotoMyLocation}
                    />
                </View>
                <Modal
                    visible={processing}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ processing: false })}
                >
                    <View
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR
                        }}
                    >
                        <View style={{ width: animationSize, height: animationSize }}>
                            <LottieView
                                ref={(ref) => this._lottie = ref}
                                source={findingLocation}
                                loop={true}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    renderConfirmLocationButton() {
        if (this.state.loading) {
            return (<ActivityIndicator size='large' color='black' />);
        }

        return (
            <Button
                title={this.props.navigation.state.params.confirmLocationButtonTitle || 'Confirm Location'}
                backgroundColor='#4099FF'
                icon={{ name: 'search' }}
                onPress={this.onConfirmLocation}
            />
        );
    }

    gotoMyLocation() {
        if (this.state.loading) {
            return;
        }

        this.setState({ loading: true }, () => {
            getCurrentLocation((latitude, longitude) => {
                const region = {
                    latitude, longitude,
                    latitudeDelta: DEFAULT_LATITUDE_DELTA,
                    longitudeDelta: DEFAULT_LONGITUDE_DELTA
                };

                this.setState({ region, location: region, loading: false }, () => this._mapView.animateToRegion(region, 800));
            });
        });
    }

    onConfirmLocation() {
        this.setState({ processing: true }, () => {
            this._lottie.play();
            const { navigation } = this.props;
            const { onComplete } = navigation.state.params;
            const { latitude, longitude } = this.state.region;
            const url = `${SEARCH_LOCATION_URL}?latitude=${latitude}&longitude=${longitude}`;
            Axios.get(url)
                .then((result) => {
                    this.setState({ processing: false });
                    _.delay(() => {
                        onComplete(result.data);
                        navigation.goBack();
                    }, 50);
                })
                .catch((error) => {
                    this.setState({ processing: false });
                    _.delay(() => Alert.alert('ERROR', 'Failed to process this location'), 50);
                });
        });
    }

    searchByAddress() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                const { latitude, longitude } = place;
                const region = {
                    latitude, longitude,
                    latitudeDelta: DEFAULT_LATITUDE_DELTA,
                    longitudeDelta: DEFAULT_LONGITUDE_DELTA
                };

                this.setState({ region, location: region, loading: false },
                    () => this._mapView.animateToRegion(region, 800));
            })
            .catch((error) => { });
    }

    renderViewLocationMapView() {
        const { region, location } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    loadingEnabled={true}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                >
                    <MapView.Circle
                        center={location}
                        radius={6400}
                        strokeColor='rgba(0, 122, 255, 1)'
                        fillColor='rgba(0, 122, 255, 0.3)'
                    />
                </MapView>
                <Icon
                    name='close'
                    size={36}
                    color='rgba(50, 50, 50, 0.8)'
                    underlayColor={DEFAULT_ICON_UNDERLAY_COLOR}
                    containerStyle={closeButtonContainer}
                    onPress={() => this.props.navigation.goBack()}
                />
            </View>
        );
    }

    onRegionChangeComplete(region) {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
        this.setState({
            region: { latitude, longitude, latitudeDelta, longitudeDelta },
            location: { latitude, longitude, latitudeDelta, longitudeDelta }
        });
    }

    render() {
        return this.renderMapView();
    }
}

export default LocationScreen;