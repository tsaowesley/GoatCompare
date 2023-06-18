// region 2. Project Libraries
import {
  CHANGE_LANGUAGE,
  CHANGE_DARKMODE,
  CHANGE_TOKEN,
} from '../actions/login';
// endregion
export const language = (state = 'en', action) => (
  action.type === CHANGE_LANGUAGE
    ? action.language
    : state
);

export const isDarkMode = (state = false, action) => (
  action.type === CHANGE_DARKMODE
    ? action.isDarkMode
    : state
);

export const token = (state = '', action) => (
  action.type === CHANGE_TOKEN
    ? action.token
    : state
);
