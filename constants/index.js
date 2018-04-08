import { Dimensions } from 'react-native';

export const GET_ACCOUNT_INFO_SUCCESS = 'GET_ACCOUNT_INFO_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const FETCH_PEOPLE_SUCCEED = 'FETCH_PEOPLE_SUCCEED';

export const UPLOAD_POST_SUCCEED = 'UPLOAD_POST_SUCCEED';
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';
export const DELETE_POST_SUCCEED = 'DELETE_POST_SUCCEED';

export const BRIGHT_THEME = 'BRIGHT_THEME';
export const DARK_THEME = 'DARK_THEME';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CLOSE_IMAGE_THRESHOLD = 50;

export const POSTS_PER_PAGE = 20;
export const COMMENTS_PER_PAGE = 20;
export const FOLLOW_UPS_PER_PAGE = 20;

export const WELCOME_SCREEN_NAME = 'welcome';
export const MAIN_SCREEN_NAME = 'main';
export const SEARCH_SCREEN_NAME = 'search';
export const COMMUNITY_SCREEN_NAME = 'community';
export const NOTIFICATION_SCREEN_NAME = 'notification';
export const MESSAGE_SCREEN_NAME = 'message';
export const HOME_SCREEN_NAME = 'home';
export const SETTINGS_SCREEN_NAME = 'settings';
export const REGISTER_SCREEN_NAME = 'register';
export const LOGIN_SCREEN_NAME = 'login';
export const LOCATION_SCREEN_NAME = 'location';
export const EDIT_PROFILE_SCREEN_NAME = 'editProfile';
export const EDIT_NAME_SCREEN_NAME = 'editName';
export const EDIT_GENDER_SCREEN_NAME = 'editGender';
export const EDIT_BIRTHDAY_SCREEN_NAME = 'editBirthday';
export const EDIT_JOB_SCREEN_NAME = 'editJob';
export const EDIT_LOCATION_SCREEN_NAME = 'editLocation';
export const EDIT_NATIONALITY_SCREEN_NAME = 'editNationality';
export const EDIT_BIO_SCREEN_NAME = 'editBio';
export const POST_SCREEN_NAME = 'post';
export const CAMERA_SCREEN_NAME = 'camera';
export const CAMERA_ROLL_SCREEN_NAME = 'cameraRoll';
export const TAG_SCREEN_NAME = 'tag';

export const PICK_LOCATION_OPERATION = 'pick';
export const VIEW_LOCATION_OPERATION = 'view';
export const ACTION_TYPE_COMMENT = 'comment';
export const ACTION_TYPE_FOLLOW_UP = 'follow_up';

export const MALE_GENDER = 'Male';
export const FEMALE_GENDER = 'Female';
export const OTHER_GENDER = 'Other';
export const GENDERS = [MALE_GENDER, FEMALE_GENDER, OTHER_GENDER];
export const STUDENT_JOB_TYPE = 'Student';
export const WORKING_JOB_TYPE = 'Working';
export const OTHER_JOB_TYPE = 'Other';
export const JOB_TYPES = [STUDENT_JOB_TYPE, WORKING_JOB_TYPE, OTHER_JOB_TYPE];

export const DEFAULT_LATITUDE_DELTA = 0.3;
export const DEFAULT_LONGITUDE_DELTA = 0.15;
export const DEFAULT_LATITUDE = 38.897957;
export const DEFAULT_LONGITUDE = -77.036560;

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PHOTO_PICKER_NUM_COLUMNS = 3;

export const MAX_POST_TAGS = 10;
export const MAX_POST_PHOTOS = 9;
export const MAX_POST_MESSAGE_LENGTH = 1500;
export const MAX_COMMENT_PHOTOS = 3;
export const MAX_COMMENT_MESSAGE_LENGTH = 300;
export const MAX_FOLLOW_UP_PHOTOS = 3;
export const MAX_FOLLOW_UP_MESSAGE_LENGTH = 300;
export const MILI_SECONDS_PER_DAY = 24 * 60 * 60 * 1000;
export const MAXIMUM_ZOOM_SCALE = 3.0;
export const MAX_BIO_LENGTH = 500;

export const POSTS_TABLE_NAME = 'posts';
export const USERS_TABLE_NAME = 'users';
export const COMMENTS_TABLE_NAME = 'comments';
export const FOLLOW_UP_TABLE_NAME = 'follow_ups';
export const ACCOUNT_INFO_TABLE_NAME = 'account_info';

export const PROFILE_PICTURES_FOLDER_NAME = 'profile_pictures';
export const POST_PICTURES_FOLDER_NAME = 'post_pictures';
export const FOLLOW_UP_PICTURES_FOLDER_NAME = 'follow_up_pictures';
export const COMMENT_PICTURES_FOLDER_NAME = 'comment_pictures';
export const WALLPAPER_PICTURES_FOLDER_NAME = 'wallpaper_pictures';

export const NULL_VIEWER_ID = 'NULL_VIEWER';

export const LIBRARY_VIDEO_TYPE = 'ALAssetTypeVideo';
export const LIBRARY_PHOTO_TYPE = 'ALAssetTypePhoto';
export const ASSET_TYPE_VIDEOS = 'Videos';
export const ASSET_TYPE_PHOTOS = 'Photos';
export const ASSET_TYPE_ALL = 'All';

export const DELETE_COMMENT_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/deleteComment';
export const DELETE_FOLLOW_UP_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/deleteFollowUp';
export const DELETE_POST_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/deletePost';
export const DOWNLOAD_COMMENTS_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadComments';
export const DOWNLOAD_FOLLOW_UPS_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadFollowUps';
export const DOWNLOAD_NEARBY_POSTS_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadNearbyPosts';
export const DOWNLOAD_POST_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadPost';
export const DOWNLOAD_USER_INFO_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadUserInfo';
export const DOWNLOAD_USER_POSTS_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/downloadUserPosts';
export const LIKE_COMMENT_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/likeComment';
export const LIKE_FOLLOW_UP_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/likeFollowUp';
export const LIKE_POST_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/likePost';
export const REGISTER_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/register';
export const SEARCH_LOCATION_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/searchLocation';
export const SEARCH_TAG_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/searchTags';
export const UNLIKE_COMMENT_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/unlikeComment';
export const UNLIKE_FOLLOW_UP_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/unlikeFollowUp';
export const UNLIKE_POST_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/unlikePost';
export const UPDATE_BIO_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateBio';
export const UPDATE_BIRTHDAY_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateBirthday';
export const UPDATE_GENDER_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateGender';
export const UPDATE_JOB_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateJob';
export const UPDATE_LOCATION_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateLocation';
export const UPDATE_NAME_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateName';
export const UPDATE_NATIONALITY_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateNationality';
export const UPDATE_PROFILE_PICTURE_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateProfilePicture';
export const UPDATE_WALLPAPER_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/updateWallpaper';
export const UPLOAD_COMMENT_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/uploadComment';
export const UPLOAD_FOLLOW_UP_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/uploadFollowUp';
export const UPLOAD_POST_URL = 'https://us-central1-nearbie-182205.cloudfunctions.net/uploadPost';

export const NATIONALITIES = require('../assets/src/data/countries.json');
export const MAJORS = require('../assets/src/data/majors.json');
export const JOBS = require('../assets/src/data/jobs.json');
export const MALE_ICON = require('../assets/pictures/maleIcon.png');
export const FEMALE_ICON = require('../assets/pictures/femaleIcon.png');
export const OTHER_GENDER_ICON = require('../assets/pictures/otherGenderIcon.png');

export const EMAIL_FORMAT = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const ACCOUNT_REDUCER_ACTIONS = [GET_ACCOUNT_INFO_SUCCESS, LOGOUT_SUCCESS];
export const PEOPLE_REDUCER_ACTIONS = [FETCH_PEOPLE_SUCCEED, LIKE_POST, UNLIKE_POST, UPLOAD_POST_SUCCEED, DELETE_POST_SUCCEED];