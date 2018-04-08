import _ from 'lodash';

import { BRIGHT_THEME_STATE, DARK_THEME_STATE } from './theme';

import { BRIGHT_THEME } from '../constants';

class ThemeManager {
    constructor() {
        this.theme = BRIGHT_THEME_STATE;
        this.listeners = [];
    }

    subscribeComponent(obj) {
        this.listeners.push(obj);
    }

    unsubscribeComponent(obj) {
        _.pull(this.listeners, obj);
    }

    get current() {
        return this.theme;
    }

    switchTheme(currentTheme) {
        if (currentTheme === BRIGHT_THEME) {
            this.theme = DARK_THEME_STATE;
        } else {
            this.theme = BRIGHT_THEME_STATE;
        }
        this.listeners.forEach((component) => component.forceUpdate());
    }
}

export const ColorTheme = new ThemeManager();