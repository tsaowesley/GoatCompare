// region 1. Platform Libraries
import { combineReducers } from 'redux';
// endregion

// region 2. Project Libraries
import {
  isDarkMode,
  language,
  token,
} from './login';
// endregion

const rootReducer = combineReducers({
  isDarkMode,
  language,
  token,
});

export default rootReducer;
