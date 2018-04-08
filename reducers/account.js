import { LOGOUT_SUCCESS, GET_ACCOUNT_INFO_SUCCESS } from '../constants';

export default function (state = null, action) {
    switch (action.type) {
        case GET_ACCOUNT_INFO_SUCCESS:
            return action.payload;
        case LOGOUT_SUCCESS:
            return null;
        default:
            return state;
    }
}