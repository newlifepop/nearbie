import { combineReducers } from 'redux';
import { filterActions } from 'redux-ignore';

import account from './account';

import { ACCOUNT_REDUCER_ACTIONS } from '../constants';

export default combineReducers({
    account: filterActions(account, ACCOUNT_REDUCER_ACTIONS),
});