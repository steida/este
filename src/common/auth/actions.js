/* global window */
import * as persistenceActions from '../persistence/actions';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const ON_AUTH_FORM_FIELD_CHANGE = 'ON_AUTH_FORM_FIELD_CHANGE';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_FORM_FIELD = 'SET_FORM_FIELD';
export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';

const FORM_FIELD_MAX_LENGTH = 100;

const validateForm = (validate, fields) => validate(fields)
  .prop('email').required().email()
  .prop('password').required().simplePassword()
  .promise;

const post = (fetch, endpoint, body) =>
  fetch(`/api/v1/${endpoint}`, {
    body: JSON.stringify(body),
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'post'
  })
  .then(response => {
    if (response.status === 200) return response.json();
    throw response;
  });

export function onAuthFormFieldChange({target: {name, value}}) {
  value = value.slice(0, FORM_FIELD_MAX_LENGTH);
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: {name, value}
  };
}

export function login(fields) {
  return ({fetch, validate, dispatch}) => ({
    type: 'LOGIN',
    payload: {
      promise: validateForm(validate, fields)
        .then(() => post(fetch, 'auth/login', fields))
        .then(response => {
          dispatch(persistenceActions.set('authToken', response.authToken));
          return response;
        })
        .catch(response => {
          // We can handle different password/username server errors here.
          if (response.status === 401)
            throw validate.wrongPassword('password');
          throw response;
        })
    }
  });
}

export function logout() {
  return ({dispatch}) => {
    dispatch(persistenceActions.remove('authToken'));

    window.location.href = '/';

    return {
      type: 'LOGOUT'
    };
  };
}
