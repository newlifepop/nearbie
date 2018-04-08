import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Axios from 'axios';
import { NavigationActions } from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import _ from 'lodash';

import { GET_ACCOUNT_INFO_SUCCESS, LOGOUT_SUCCESS, USERS_TABLE_NAME, ACCOUNT_INFO_TABLE_NAME, MALE_GENDER, MALE_ICON, FEMALE_GENDER, FEMALE_ICON, OTHER_GENDER_ICON, MONTHS, STUDENT_JOB_TYPE, LOCATION_SCREEN_NAME, VIEW_LOCATION_OPERATION, PROFILE_PICTURES_FOLDER_NAME, UPDATE_PROFILE_PICTURE_URL, UPDATE_WALLPAPER_URL, WALLPAPER_PICTURES_FOLDER_NAME, UPDATE_LOCATION_URL, MAJORS, JOBS, NATIONALITIES, SCREEN_WIDTH } from '../constants';

import { DARK_THEME_COMPONENT_BACKGROUND_COLOR, DEFAULT_IMAGE_MARGIN } from '../styles';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export function accountStateChanged(user = null) {
    return function (dispatch) {
        if (user) {
            firebase.database().ref(USERS_TABLE_NAME).child(user.uid).child(ACCOUNT_INFO_TABLE_NAME)
                .on('value', (snapshot) => dispatch({ type: GET_ACCOUNT_INFO_SUCCESS, payload: snapshot.val() }));
        } else {
            dispatch({ type: LOGOUT_SUCCESS });
        }
    }
}

export function updateProfilePicture(uid, hash, path) {
    showSnackbar('Updating profile picture in background');

    let imageFile = RNFetchBlob.wrap(path);
    const fileName = `${Math.floor(Math.random() * 100000)}_${uid}`;
    const imageRef = firebase.storage().ref(PROFILE_PICTURES_FOLDER_NAME).child(fileName);
    let uploadBlob = null;

    Blob.build(imageFile, { type: 'image/jpg' })
        .then((imageBlob) => {
            uploadBlob = imageBlob;
            return imageRef.put(imageBlob, { contentType: 'image/jpg' });
        })
        .then(() => {
            uploadBlob.close();
            const photoPath = `${PROFILE_PICTURES_FOLDER_NAME}/${fileName}`;
            return Axios.post(UPDATE_PROFILE_PICTURE_URL, { uid, hash, photoPath });
        })
        .then(() => showSnackbar('Profile picture updated'))
        .catch(() => showErrorSnackbar('Unable to update profile picture, please try again'));
}

export function updateWallpaper(uid, hash, path) {
    showSnackbar('Updating wallpaper in background');

    let imageFile = RNFetchBlob.wrap(path);
    const fileName = `${Math.floor(Math.random() * 100000)}_${uid}`;
    const imageRef = firebase.storage().ref(WALLPAPER_PICTURES_FOLDER_NAME).child(fileName);
    let uploadBlob = null;

    Blob.build(imageFile, { type: 'image/jpg' })
        .then((imageBlob) => {
            uploadBlob = imageBlob;
            return imageRef.put(imageBlob, { contentType: 'image/jpg' });
        })
        .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
        })
        .then((wallpaperUrl) => {
            return Axios.post(UPDATE_WALLPAPER_URL, { uid, hash, wallpaperUrl })
        })
        .then(() => showSnackbar('Wallpaper updated'))
        .catch(() => showErrorSnackbar('Unable to update wallpaper, please try again'));
}

export function updateLocation(uid, hash, location) {
    showSnackbar('Updating location in background');

    Axios.post(UPDATE_LOCATION_URL, { uid, hash, location })
        .then(() => showSnackbar('Location updated'))
        .catch(() => showErrorSnackbar('Unable to update location, please try again'));
}

export function uploadPost(currentUser, post) {
    return async function (dispatch) {
        showSnackbar('Uploading post in background');
    }
}

// Helper functions
/*
export function getCurrentLocation(callback) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            if (callback) {
                callback(latitude, longitude);
            }
        }
    );
};
*/

export function getCurrentLocation(callback) {
    if (callback) {
        callback(41.83498584437659, -87.6576389045517);
    }
}

export function formatAddress(address) {
    return address.length >= 40 ? `${address.slice(0, 37)}...` : address;
}

export function formatJobTitle(jobTitle) {
    return jobTitle.length >= 30 ? `${jobTitle.slice(0, 27)}...` : jobTitle;
}

export function formatName(firstName, lastName) {
    const fullName = `${firstName} ${lastName}`;

    if (fullName.length <= 16) {
        return fullName;
    } else if (firstName.length <= 15) {
        return `${firstName} ${lastName.slice(0, 1)}.`
    } else {
        return `${firstName.slice(0, 1)}. ${lastName.slice(0, 1)}.`;
    }
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getRandomId() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

export function renderGenderIcon(gender) {
    if (gender === MALE_GENDER) {
        return MALE_ICON;
    } else if (gender === FEMALE_GENDER) {
        return FEMALE_ICON;
    }
    return OTHER_GENDER_ICON;
}

export function formatNumberToTwoDigits(number) {
    const str = `${number}`;
    if (str.length < 2) {
        return `0${str}`;
    }

    return str;
}

export function dateToDisplay(date, currentDate) {
    const diffInHours = dateDiffInHours(currentDate, date);
    let dateToDisplay;

    if (diffInHours <= 1 / 60) {
        dateToDisplay = 'Just Now';
    } else if (diffInHours < 1) {
        dateToDisplay = `${Math.floor(diffInHours * 60)} minute(s) ago`;
    } else if (diffInHours <= 24) {
        dateToDisplay = `${Math.floor(diffInHours)} hour(s) ago`
    } else if (diffInHours <= 4 * 24) {
        dateToDisplay = `${Math.floor(diffInHours / 24)} day(s) ago`
    } else {
        var hour = date.getHours();
        var minute = date.getMinutes();
        var month = MONTHS[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();
        var half = hour >= 12 ? 'pm' : 'am';

        if (hour > 12) {
            hour -= 12;
        }

        hour = formatNumberToTwoDigits(hour);
        minute = formatNumberToTwoDigits(minute);
        day = formatNumberToTwoDigits(day);

        if (year !== currentDate.getFullYear()) {
            dateToDisplay = `${hour}:${minute} ${half} ${month} ${day}, ${year}`;
        } else {
            dateToDisplay = `${hour}:${minute} ${half} ${month} ${day}`;
        }
    }

    return dateToDisplay;
}

export function formatRemainingTime(seconds) {
    const minute = parseInt(Math.floor(seconds / 60));
    const second = parseInt(Math.floor(seconds - minute * 60));
    return `${minute}:${formatNumberToTwoDigits(second)}`;
}

export function formatBirthday(birthday) {
    if (!birthday) {
        return '';
    }

    const month = MONTHS[birthday.getMonth()];
    const day = birthday.getDate();
    const year = birthday.getFullYear();

    return `${month} ${formatNumberToTwoDigits(day)}, ${year}`;
}

export function getJobIconName(type) {
    return type === STUDENT_JOB_TYPE ? 'school' : 'work';
}

export function viewLocation(location, navigation) {
    const { latitude, longitude } = location.coords;
    const viewLocationAction = NavigationActions.navigate({
        routeName: LOCATION_SCREEN_NAME,
        params: { actionType: VIEW_LOCATION_OPERATION, latitude, longitude }
    });

    navigation.dispatch(viewLocationAction);
}

export function showSnackbar(title) {
    Snackbar.show({
        title, duration: Snackbar.LENGTH_LONG,
        backgroundColor: DARK_THEME_COMPONENT_BACKGROUND_COLOR
    });
}

export function showErrorSnackbar(title) {
    Snackbar.show({
        title, duration: Snackbar.LENGTH_INDEFINITE,
        backgroundColor: DARK_THEME_COMPONENT_BACKGROUND_COLOR,
        action: { title: 'OK', color: '#4099FF' }
    });
}

export function findMajor(query) {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : MAJORS.filter(major =>
        major.toLowerCase().slice(0, inputLength) === inputValue);
}

export function findJob(query) {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : JOBS.filter(job =>
        job.toLowerCase().slice(0, inputLength) === inputValue);
}

export function findNationality(query) {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : NATIONALITIES.filter(country =>
        country.country.toLowerCase().slice(0, inputLength) === inputValue);
}

export function getPostPhotosPerLine(photoCount) {
    switch (photoCount) {
        case 1:
            return 1;
        case 2:
        case 4:
            return 2;
        default:
            return 3;
    }
}

export function getPostPhotoStyle(photoCount) {
    let width = 0;

    switch (photoCount) {
        case 1:
            width = (SCREEN_WIDTH - 20) * 2 / 3;
            return {
                width, height: width * 0.75,
                backgroundColor: 'rgba(0, 0, 0, 0)'
            };
        case 2:
        case 4:
            width = (((SCREEN_WIDTH - 20) * 2 / 3) - DEFAULT_IMAGE_MARGIN) / 2;
            return {
                width, height: width,
                marginRight: DEFAULT_IMAGE_MARGIN,
                backgroundColor: 'rgba(0, 0, 0, 0)'
            };
        default:
            width = (SCREEN_WIDTH - 30) / 3;
            return {
                width, height: width,
                marginRight: DEFAULT_IMAGE_MARGIN,
                backgroundColor: 'rgba(0, 0, 0, 0)'
            };
    }
}