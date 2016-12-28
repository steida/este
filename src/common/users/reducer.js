/* @flow */
import type { Action, UsersState } from '../types';
import createUserFirebase from './createUserFirebase';
import compose from 'ramda/src/compose';
import last from 'ramda/src/last';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import values from 'ramda/src/values';

const initialState = {
  // Undefined is absence of evidence, null is evidence of absence.
  online: undefined,
  viewer: undefined,
};

const reducer = (
  state: UsersState = initialState,
  action: Action,
): UsersState => {
  switch (action.type) {

    case 'ON_AUTH': {
      const user = createUserFirebase(action.payload.firebaseUser);
      return { ...state, viewer: user };
    }

    case 'ON_USERS_PRESENCE': {
      const { presence } = action.payload;
      if (!presence) {
        return { ...state, online: null };
      }
      const sortBylastSeenAt = sortBy(prop('lastSeenAt'));
      const online = compose(
        map(item => item.user),
        sortBy(sortBylastSeenAt),
        values,
        map(compose(last, sortBylastSeenAt, values)),
      )(presence);
      return { ...state, online };
    }

    default:
      return state;

  }
};

export default reducer;
