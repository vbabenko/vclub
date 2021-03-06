import initialState from 'vclub/redux/initialClubState';

export const AUTH = 'club/auth/auth';
export const LOG_OUT = 'club/auth/log-out';
export const RESTORE_AUTH = 'club/auth/restoreAuth';

export function auth(authData, remember = false) {
  return {
    type: AUTH,
    payload: authData,
    meta: {
      sideEffects: [({ ioSocket, localStorage }) => {
        ioSocket.emit('auth', authData);

        if (remember) {
          localStorage.setItem('name', authData.name);
          localStorage.setItem('master', authData.master);
        }
      }],
    },
  };
}

export function restoreAuth() {
  return {
    type: RESTORE_AUTH,
    meta: {
      sideEffects: [({ dispatch, localStorage }) => {
        const name = localStorage.getItem('name');
        const master = localStorage.getItem('master') === 'true';

        if (name) {
          dispatch(auth({ name, master }));
        }
      }],
    },
  };
}

export function logOut() {
  return {
    type: LOG_OUT,
    meta: {
      sideEffects: [({ localStorage }) => {
        localStorage.removeItem('name');
        localStorage.removeItem('master');

        document.location.reload();
      }],
    },
  };
}


export default function reducer(state, action) {
  if (action.type === AUTH) {
    return {
      ...state,
      authenticating: true,
    };
  }

  return state || initialState.auth;
}
