/* action types */
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_DARKMODE = 'CHANGE_DARKMODE';
export const CHANGE_TOKEN = 'CHANGE_TOKEN';
export const createChangeLanguage = (language) => ({
  type: CHANGE_LANGUAGE,
  language,
});

export const createChangeDarkMode = (isDarkMode) => ({
  type: CHANGE_DARKMODE,
  isDarkMode,
});

export const createChangeToken = (token) => ({
  type: CHANGE_TOKEN,
  token,
});
