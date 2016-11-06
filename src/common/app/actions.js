export const APP_OFFLINE = 'APP_OFFLINE';
export const APP_ONLINE = 'APP_ONLINE';
export const APP_SET_LOCATION = 'APP_SET_LOCATION';
export const APP_SHOW_MENU = 'APP_SHOW_MENU';
export const APP_START = 'APP_START';
export const APP_STORAGE_LOAD = 'APP_STORAGE_LOAD';
export const TOGGLE_MENU = 'TOGGLE_MENU';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const setLocation = (location) => ({
  type: APP_SET_LOCATION,
  payload: { location },
});

export const login = () => ({
  type: LOGIN
});

export const logout = () => ({
  type: LOGOUT
});

export const toggleMenu = () => ({
  type: TOGGLE_MENU
});

export const showMenu = (show) => ({
  type: APP_SHOW_MENU,
  payload: { show },
});

export const start = () =>
  () =>
    ({
      type: APP_START,
    });
