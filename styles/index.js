import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export * from './theme';
export * from './ThemeManager';

export const DEFAULT_HEADER_ICON_SIZE = 28;
export const DEFAULT_HEADER_ICON_COLOR = '#4099FF';
export const DEFAULT_ICON_UNDERLAY_COLOR = 'rgba(0, 0, 0, 0)';
export const DEFAULT_BUTTON_UNDERLAY_COLOR = 'rgba(0, 0, 0, 0)';
export const DEFAULT_ACTIVE_OPACITY = 0.5;
export const DEFAULT_IMAGE_MARGIN = 5;
export const DEFAULT_TRANSPARENT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.75)';
export const DEFAULT_PARALLAX_HEADER_HEIGHT = 170;
export const DEFAULT_PROFILE_PICTURE_SIZE = 70;
export const DEFAULT_HEADER_HEIGHT = 70;
export const DEFAULT_DETAILED_INFO_ICON_SIZE = 22;

export const headerText = {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black'
};

export const tabBarContainer = {
    flexDirection: 'row',
    height: 44,
    borderTopWidth: 1,
    borderTopColor: '#DFDFDF'
};

export const tabBarIconContainer = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
};

export const introContainer = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
};

export const introText = {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 26,
    marginHorizontal: 10
};

export const loginMenuContainer = {
    width: SCREEN_WIDTH,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
};

export const forgotPasswordButton = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginVertical: 5,
    marginHorizontal: 10
};

export const forgotPasswordText = {
    fontSize: 16,
    color: '#4099FF',
    marginVertical: 5
};

export const loginButtonContainer = {
    backgroundColor: '#4099FF',
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 8
};

export const loginButtonText = {
    fontSize: 18,
    color: 'white',
    marginHorizontal: 10,
    marginVertical: 5
};

export const inputContainer = {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#DFDFDF',
    marginHorizontal: 10
};

export const inputStyle = {
    fontSize: 18,
    color: 'black',
    paddingBottom: 5
};

export const charCountContainer = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
    marginTop: 5
};

export const charCountText = {
    fontSize: 10,
    color: 'gray',
    fontStyle: 'italic'
};

export const formLabelStyle = {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: '#3C6478',
    fontWeight: 'bold'
};

export const formInputStyle = {
    ...inputStyle,
    marginHorizontal: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3'
};

export const buttonGroupContainer = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10
};

export const registerButtonContainer = {
    width: SCREEN_WIDTH,
    backgroundColor: '#4099FF'
};

export const registerButton = {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH
};

export const registerButtonText = {
    fontSize: 20,
    color: 'white',
    marginVertical: 8
};

export const defaultProfilePicture = {
    width: DEFAULT_PROFILE_PICTURE_SIZE,
    height: DEFAULT_PROFILE_PICTURE_SIZE,
    borderRadius: DEFAULT_PROFILE_PICTURE_SIZE / 2,
    backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR
};

export const detailedInfoContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
};

export const detailedInfoText = {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
    marginRight: 10
};

export const drawerIcon = {
    width: 26,
    height: 26,
    marginRight: 10
};

export const drawerMenuTitle = {
    fontWeight: '500',
    fontSize: 18
};

export const drawerHeaderContainer = {
    height: SCREEN_HEIGHT / 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
};

export const drawerProfilePicture = {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 32,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#DFDFDF'
};

export const drawerName = {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 8,
    marginLeft: 8
};

export const drawerEmail = {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 8
};

export const parallaxHeaderIconContainer = {
    position: 'absolute',
    top: 23, width: 34, height: 34, borderRadius: 17,
    backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR
};

export const addressInputContainer = {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flexDirection: 'row',
    alignItems: 'center'
};

export const addressInputButton = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    backgroundColor: 'white'
};

export const confirmAddressButtonContainer = {
    position: 'absolute',
    bottom: 10,
    width: SCREEN_WIDTH
};

export const currentLocationButtonContainer = {
    position: 'absolute',
    bottom: 60,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'space-between'
};

export const closeButtonContainer = {
    position: 'absolute',
    top: 32,
    right: 10
};

export const videoPlayerMenuContainer = {
    position: 'absolute', right: 3, bottom: 3, width: 50, height: 26,
    justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    backgroundColor: DEFAULT_TRANSPARENT_BACKGROUND_COLOR,
};

export const videoPlayerTimer = {
    fontSize: 14,
    color: 'rgb(200, 200, 200)'
};

export const cameraHeaderIconContainer = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center'
};

export const cameraFooterIconContainer = {
    margin: 16, width: 46, height: 46,
    borderRadius: 23, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', alignItems: 'center'
};

export const cameraFooterContainer = {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    left: 0, bottom: 0, right: 0
};

export const cameraCaptureButtonContainer = {
    width: 70, height: 70,
    borderRadius: 35, justifyContent: 'center',
    alignItems: 'center', margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1, borderColor: 'black'
};

export const addPhotoButtonContainer = {
    width: (SCREEN_WIDTH - 36) / 3,
    height: (SCREEN_WIDTH - 36) / 3,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#DFDFDF'
};

export const tagContainer = {
    borderWidth: 1,
    borderColor: '#4099FF',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginRight: 10
};

export const tagText = {
    fontSize: 14,
    color: '#4099FF',
    fontWeight: 'bold'
};

export const socialBarIconContainer = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
};

export const socialBarQuantityStyle = {
    fontSize: 12,
    color: 'gray',
    marginLeft: 8
};