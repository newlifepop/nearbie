import { BRIGHT_THEME, DARK_THEME } from '../constants';

// Bright theme
export const BRIGHT_THEME_BORDER_COLOR = 'rgb(220, 220, 220)';
export const BRIGHT_THEME_TEXT_COLOR = 'rgb(50, 50, 50)';
export const BRIGHT_THEME_MAIN_BACKGROUND_COLOR = 'rgb(240, 240, 240)';
export const BRIGHT_THEME_COMPONENT_BACKGROUND_COLOR = 'white';
export const BRIGHT_THEME_SHADOW_COLOR = 'rgb(50, 50, 50)';
export const BRIGHT_THEME_ICON_COLOR = 'rgb(80, 80, 80)';

// Dark theme
export const DARK_THEME_BORDER_COLOR = 'rgb(70, 70, 70)';
export const DARK_THEME_TEXT_COLOR = 'rgb(200, 200, 200)';
export const DARK_THEME_MAIN_BACKGROUND_COLOR = 'rgb(50, 50, 50)';
export const DARK_THEME_COMPONENT_BACKGROUND_COLOR = 'rgb(55, 55, 55)';
export const DARK_THEME_SHADOW_COLOR = 'rgb(200, 200, 200)';
export const DARK_THEME_ICON_COLOR = 'rgb(200, 200, 200)';

export const BRIGHT_THEME_STATE = {
    theme: BRIGHT_THEME,
    textColor: BRIGHT_THEME_TEXT_COLOR,
    backgroundColor: BRIGHT_THEME_MAIN_BACKGROUND_COLOR,
    componentBackgroundColor: BRIGHT_THEME_COMPONENT_BACKGROUND_COLOR,
    borderColor: BRIGHT_THEME_BORDER_COLOR,
    iconColor: BRIGHT_THEME_ICON_COLOR,
    statusBar: 'dark-content'
};

export const DARK_THEME_STATE = {
    theme: DARK_THEME,
    textColor: DARK_THEME_TEXT_COLOR,
    backgroundColor: DARK_THEME_MAIN_BACKGROUND_COLOR,
    componentBackgroundColor: DARK_THEME_COMPONENT_BACKGROUND_COLOR,
    borderColor: DARK_THEME_BORDER_COLOR,
    iconColor: DARK_THEME_ICON_COLOR,
    statusBar: 'light-content'
};