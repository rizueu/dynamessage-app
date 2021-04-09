export const login = token => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN',
      token,
    });
  };
};

export const refresh = () => {
  return {
    type: 'SET_REFRESH',
  };
};

export const reset_token = () => {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT',
      token: null,
      errorMsg: null,
    });
  };
};

export const setNullError = () => {
  return async dispatch => {
    dispatch({
      type: 'SET_NULL_ERROR',
      errorMsg: null,
    });
  };
};
