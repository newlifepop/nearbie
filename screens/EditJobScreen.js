import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, Text, FlatList, SegmentedControlIOS, Platform, UIManager, LayoutAnimation, StatusBar, ActionSheetIOS } from 'react-native';
import { Header, Icon, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import Axios from 'axios';
import _ from 'lodash';

import { findMajor, findJob, getJobIconName, formatJobTitle } from '../actions';

import { formInputStyle, ColorTheme, headerText, DEFAULT_HEADER_ICON_SIZE, DEFAULT_ICON_UNDERLAY_COLOR, DEFAULT_ACTIVE_OPACITY } from '../styles';

import { JOB_TYPES, SCREEN_WIDTH, OTHER_JOB_TYPE, STUDENT_JOB_TYPE, WORKING_JOB_TYPE, UPDATE_JOB_URL } from '../constants';

import { DropdownAlert, DefaultModal } from '../components';

class EditJobScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentUser: null,
            job: {
                type: '',
                title: ''
            },
            query: '',
            error: '',
            jobs: []
        };

        this.onSubmitChanges = this.onSubmitChanges.bind(this);
        this.onChangeJobType = this.onChangeJobType.bind(this);
        this.onChooseJob = this.onChooseJob.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeJobType = this.onChangeJobType.bind(this);
        this.onCreateJobTitle = this.onCreateJobTitle.bind(this);
        this.searchJobs = _.debounce(this.searchJobTitles, 300);
        this.onRemoveJob = this.onRemoveJob.bind(this);
    }

    componentWillMount() {
        ColorTheme.subscribeComponent(this);
        const { currentUser } = this.props;
        const { job } = currentUser;
        this.setState({
            currentUser,
            job: {
                type: job ? job.type : STUDENT_JOB_TYPE,
                title: job ? job.title : ''
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;
        const { job } = currentUser;
        this.setState({
            currentUser,
            job: {
                type: job ? job.type : STUDENT_JOB_TYPE,
                title: job ? job.title : ''
            }
        });
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
        const { currentUser, job } = this.state;
        const { type, title } = job;

        if (title === '') {
            this.setState({ error: 'Please select your job and job title' });
        } else {
            this.setState({ loading: true, error: '' }, () => {
                const { uid, hash } = currentUser;
                Axios.post(UPDATE_JOB_URL, { uid, hash, job: { type, title } })
                    .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                    .catch((error) => this.setState({ loading: false, error: 'Unable to update job, please try again' }));
            });
        }
    }

    onChooseJob(job) {
        this.setState({ job: { ...this.state.job, title: job }, error: '', query: '', jobs: [] });
    }

    onChangeText(text) {
        this.setState({ query: text, error: '' }, this.searchJobs);
    }

    onChangeJobType(value) {
        this.setState({ job: { type: value, title: value === OTHER_JOB_TYPE ? 'Other' : '' }, error: '' });
    }

    onCreateJobTitle() {
        const { query, job } = this.state;
        if (query.replace(' ', '') === '') {
            this.setState({ error: `Please create a valid ${job.type === STUDENT_JOB_TYPE ? 'major' : 'job'}` });
            return;
        }

        this.setState({ error: '', query: '', job: { ...job, title: query } });
    }

    searchJobTitles() {
        const { query, job } = this.state;

        switch (job.type) {
            case STUDENT_JOB_TYPE:
                this.setState({ jobs: findMajor(query) });
                break;
            case WORKING_JOB_TYPE:
                this.setState({ jobs: findJob(query) });
                break;
            default:
                return [];
        }
    }

    onRemoveJob() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Do you want to delete your job?',
            options: [
                'Remove Job',
                'Cancel'
            ],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.setState({ loading: true, error: '' }, () => {
                    const { uid, hash } = this.state.currentUser;
                    Axios.post(UPDATE_JOB_URL, { uid, hash, job: null })
                        .then(() => this.setState({ loading: false }, () => this.props.navigation.goBack()))
                        .catch((error) => this.setState({ loading: false, error: 'Unable to remove job, please try again' }));
                });
            }
        });
    }

    render() {
        const { loading, currentUser, job, query, error, jobs } = this.state;

        if (!currentUser) {
            return (<View />);
        }

        const { type, title } = job;
        const { statusBar, textColor, iconColor, backgroundColor, componentBackgroundColor, borderColor } = ColorTheme.current;

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
                Edit Job
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
                    onPress={this.onRemoveJob}
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
                <StatusBar barStyle={statusBar} />
                <Header
                    outerContainerStyles={{ backgroundColor: componentBackgroundColor, borderBottomWidth: 0 }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <View
                    style={{
                        width: SCREEN_WIDTH, padding: 5,
                        backgroundColor: componentBackgroundColor
                    }}
                >
                    <SegmentedControlIOS
                        values={JOB_TYPES}
                        selectedIndex={JOB_TYPES.indexOf(type)}
                        onValueChange={this.onChangeJobType}
                    />
                </View>
                {type !== OTHER_JOB_TYPE && <View
                    style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: componentBackgroundColor
                    }}
                >
                    <SearchBar
                        containerStyle={{
                            backgroundColor: componentBackgroundColor,
                            borderTopWidth: 0, borderBottomWidth: 0, flex: 1
                        }}
                        autoFocus={true}
                        inputStyle={{ backgroundColor, color: textColor }}
                        placeholder='Search or Create'
                        placeholderTextColor={textColor}
                        onChangeText={this.onChangeText}
                        value={query}
                    />
                    <TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={{ marginRight: 5 }}
                        onPress={this.onCreateJobTitle}
                    >
                        <Text style={{ color: '#4099FF', fontSize: 16 }}>
                            Create
                        </Text>
                    </TouchableOpacity>
                </View>}
                <View
                    style={{
                        backgroundColor: componentBackgroundColor,
                        flexDirection: 'row', alignItems: 'center',
                        paddingBottom: 5, borderBottomWidth: 1,
                        borderBottomColor: borderColor
                    }}
                >
                    <Icon
                        name={getJobIconName(type)}
                        size={24}
                        color='#4099FF'
                        containerStyle={{ marginLeft: 10 }}
                    />
                    <Text
                        style={{
                            color: '#4099FF', fontWeight: 'bold',
                            fontSize: 18, marginHorizontal: 10
                        }}
                    >
                        {title === '' ? '(Unspecified)' : formatJobTitle(title)}
                    </Text>
                </View>
                {type !== OTHER_JOB_TYPE && <FlatList
                    data={jobs}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps='always'
                    renderItem={({ item }) => (<TouchableOpacity
                        activeOpacity={DEFAULT_ACTIVE_OPACITY}
                        style={{
                            backgroundColor: componentBackgroundColor,
                            borderBottomWidth: 1, borderBottomColor: borderColor
                        }}
                        onPress={() => this.onChooseJob(item)}
                    >
                        <Text style={{ fontSize: 18, color: textColor, margin: 10 }}>
                            {item}
                        </Text>
                    </TouchableOpacity>)}
                />}
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => this.setState({ loading: false })}
                >
                    <DefaultModal text='Updating job ...' />
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

export default connect(mapStateToProps, null)(EditJobScreen);